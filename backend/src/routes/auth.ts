import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { licenseCodes, sessions } from "../db/schema.js";
import type { AppConfig } from "../lib/config.js";
import { SESSION_COOKIE } from "../lib/config.js";
import { normalizeLicenseCode } from "../lib/code.js";
import { clientIpFromRequest } from "../lib/client-ip.js";
import { hashLicenseCode } from "../lib/hash.js";
import { checkRateLimit, recordFailure } from "../lib/rate-limit.js";
import {
  clearSessionCookie,
  countActiveSessions,
  createOrRefreshSession,
  deleteSessionByToken,
  getSessionUsage,
  logActivation,
  resolveSessionFromCookie,
  setSessionCookie,
} from "../lib/session.js";

const loginSchema = z.object({
  code: z.string().min(8).max(32),
  deviceId: z.string().min(8).max(128),
  deviceLabel: z.string().max(255).optional(),
});

function readSessionCookie(request: FastifyRequest): string | undefined {
  const cookies = request.cookies as Record<string, string | undefined>;
  return cookies[SESSION_COOKIE];
}

function loginError(reply: FastifyReply, status: number, code: string, message: string) {
  return reply.code(status).send({ ok: false, code, message });
}

export async function registerAuthRoutes(app: FastifyInstance, config: AppConfig): Promise<void> {
  await app.register(import("@fastify/cookie"));

  app.get("/health", async () => ({ ok: true }));

  app.get("/config/public", async () => ({
    contactWechat: config.contactWechat,
    contactEmail: config.contactEmail,
    maxDevicesDefault: config.maxDevicesDefault,
  }));

  app.get("/verify", async (request, reply) => {
    const ip = clientIpFromRequest(request.headers as Record<string, unknown>, request.ip);
    const resolved = await resolveSessionFromCookie(readSessionCookie(request), config, ip);
    if (!resolved.ok) {
      return reply.code(401).send();
    }
    return reply.code(200).send();
  });

  app.get("/session/status", async (request, reply) => {
    const ip = clientIpFromRequest(request.headers as Record<string, unknown>, request.ip);
    const resolved = await resolveSessionFromCookie(readSessionCookie(request), config, ip);
    if (!resolved.ok) {
      return reply.send({
        ok: false,
        authenticated: false,
      });
    }

    const usage = await getSessionUsage(resolved.licenseCodeId, config);
    return reply.send({
      ok: true,
      authenticated: true,
      devicesUsed: usage.used,
      devicesMax: usage.max,
    });
  });

  app.post("/login", async (request, reply) => {
    const ip = clientIpFromRequest(request.headers as Record<string, unknown>, request.ip);
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return loginError(reply, 400, "INVALID_REQUEST", "请填写有效的授权码");
    }

    const rateKey = `login:${ip}`;
    if (!checkRateLimit(rateKey, config.loginRateLimit)) {
      return loginError(reply, 429, "RATE_LIMITED", "尝试次数过多，请稍后再试");
    }

    const normalized = normalizeLicenseCode(parsed.data.code);
    if (!normalized) {
      recordFailure(rateKey, config.loginRateLimit);
      await logActivation(null, "login_fail", ip, request.headers["user-agent"] as string | undefined, {
        reason: "invalid_format",
      });
      return loginError(reply, 401, "INVALID_CODE", "授权码无效或已停用");
    }

    const codeHash = hashLicenseCode(normalized, config.sessionSecret);
    const license = await db.select().from(licenseCodes).where(eq(licenseCodes.codeHash, codeHash)).limit(1);
    const row = license[0];

    if (!row || row.status !== "active") {
      recordFailure(rateKey, config.loginRateLimit);
      await logActivation(row?.id ?? null, "login_fail", ip, request.headers["user-agent"] as string | undefined, {
        reason: "invalid_or_disabled",
      });
      return loginError(reply, 401, "INVALID_CODE", "授权码无效或已停用");
    }

    if (row.expiresAt && row.expiresAt <= new Date()) {
      recordFailure(rateKey, config.loginRateLimit);
      await logActivation(row.id, "login_fail", ip, request.headers["user-agent"] as string | undefined, {
        reason: "code_expired",
      });
      return loginError(reply, 403, "CODE_EXPIRED", "授权码已过期");
    }

    const existingDevice = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.licenseCodeId, row.id), eq(sessions.deviceId, parsed.data.deviceId)))
      .limit(1);

    if (!existingDevice[0]) {
      const activeCount = await countActiveSessions(row.id, config);
      if (activeCount >= row.maxDevices) {
        const usage = await getSessionUsage(row.id, config);
        return reply.code(409).send({
          ok: false,
          code: "DEVICE_LIMIT",
          message: "设备位已满，请先解绑旧设备或联系客服",
          devicesUsed: usage.used,
          devicesMax: usage.max,
        });
      }
    }

    const session = await createOrRefreshSession({
      licenseCodeId: row.id,
      deviceId: parsed.data.deviceId,
      deviceLabel: parsed.data.deviceLabel,
      ip,
      config,
    });

    setSessionCookie(reply, session.token, session.expiresAt, config.cookieSecure);
    const usage = await getSessionUsage(row.id, config);

    await logActivation(row.id, "login_success", ip, request.headers["user-agent"] as string | undefined, {
      deviceId: parsed.data.deviceId,
    });

    return reply.send({
      ok: true,
      devicesUsed: usage.used,
      devicesMax: usage.max,
    });
  });

  app.post("/logout", async (request, reply) => {
    const ip = clientIpFromRequest(request.headers as Record<string, unknown>, request.ip);
    const token = readSessionCookie(request);
    const resolved = await resolveSessionFromCookie(token, config, ip);
    if (resolved.ok) {
      await deleteSessionByToken(token, config);
      await logActivation(resolved.licenseCodeId, "logout", ip, request.headers["user-agent"] as string | undefined);
    }
    clearSessionCookie(reply);
    return reply.send({ ok: true });
  });
}
