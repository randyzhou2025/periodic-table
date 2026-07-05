import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { activationLogs, licenseCodes, sessions } from "../db/schema.js";
import type { AppConfig } from "../lib/config.js";
import {
  clearAdminSessionCookie,
  createAdminSessionToken,
  readAdminSessionCookie,
  setAdminSessionCookie,
  verifyAdminCredentials,
  verifyAdminSessionToken,
} from "../lib/admin-auth.js";
import { generateLicenseCode } from "../lib/code.js";
import { resolveIpLocation } from "../lib/ip-location.js";
import { clientIpFromRequest } from "../lib/client-ip.js";
import { codePrefixFromNormalized, hashLicenseCode } from "../lib/hash.js";
import { checkRateLimit, recordFailure } from "../lib/rate-limit.js";
import { countActiveSessions } from "../lib/session.js";

function authenticateAdmin(config: AppConfig) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const token = readAdminSessionCookie(request);
    if (!verifyAdminSessionToken(token, config)) {
      return reply.code(401).send({ error: "未登录或会话已过期" });
    }
  };
}

const adminLoginSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(128),
});

const createCodeSchema = z.object({
  buyerNote: z.string().max(255).optional(),
  maxDevices: z.number().int().min(1).max(10).optional(),
  expiresAt: z.string().datetime().optional().nullable(),
});

const patchCodeSchema = z.object({
  status: z.enum(["active", "disabled"]).optional(),
  buyerNote: z.string().max(255).optional().nullable(),
  maxDevices: z.number().int().min(1).max(10).optional(),
  expiresAt: z.string().datetime().optional().nullable(),
});

export async function registerAdminRoutes(app: FastifyInstance, config: AppConfig): Promise<void> {
  const guard = authenticateAdmin(config);

  app.post("/admin/login", async (request, reply) => {
    const ip = clientIpFromRequest(request.headers as Record<string, unknown>, request.ip);
    const rateKey = `admin-login:${ip}`;
    if (!checkRateLimit(rateKey, config.loginRateLimit)) {
      return reply.code(429).send({ ok: false, message: "尝试次数过多，请稍后再试" });
    }

    const parsed = adminLoginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ ok: false, message: "请输入用户名和密码" });
    }

    const { username, password } = parsed.data;
    if (!verifyAdminCredentials(username, password, config)) {
      recordFailure(rateKey, config.loginRateLimit);
      return reply.code(401).send({ ok: false, message: "用户名或密码错误" });
    }

    const token = createAdminSessionToken(config);
    setAdminSessionCookie(reply, token, config);
    return reply.send({ ok: true, username: config.adminUsername });
  });

  app.post("/admin/logout", async (_request, reply) => {
    clearAdminSessionCookie(reply);
    return reply.send({ ok: true });
  });

  app.get("/admin/session/status", async (request, reply) => {
    const token = readAdminSessionCookie(request);
    if (!verifyAdminSessionToken(token, config)) {
      return reply.send({ ok: false, authenticated: false });
    }
    return reply.send({ ok: true, authenticated: true, username: config.adminUsername });
  });

  app.get("/admin/codes", { preHandler: guard }, async () => {
    const rows = await db.select().from(licenseCodes).orderBy(desc(licenseCodes.createdAt));
    const enriched = await Promise.all(
      rows.map(async (row) => ({
        id: row.id,
        codePrefix: row.codePrefix,
        maxDevices: row.maxDevices,
        status: row.status,
        expiresAt: row.expiresAt,
        buyerNote: row.buyerNote,
        createdAt: row.createdAt,
        activeSessions: await countActiveSessions(row.id, config),
      }))
    );
    return { codes: enriched };
  });

  app.post("/admin/codes", { preHandler: guard }, async (request, reply) => {
    const parsed = createCodeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "参数无效" });
    }

    let normalized = "";
    let formatted = "";
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const generated = generateLicenseCode();
      normalized = generated.normalized;
      formatted = generated.formatted;
      const codeHash = hashLicenseCode(normalized, config.sessionSecret);
      try {
        const inserted = await db
          .insert(licenseCodes)
          .values({
            codeHash,
            codePrefix: codePrefixFromNormalized(normalized),
            maxDevices: parsed.data.maxDevices ?? config.maxDevicesDefault,
            buyerNote: parsed.data.buyerNote,
            expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
          })
          .returning();
        return reply.code(201).send({
          code: formatted,
          license: inserted[0],
        });
      } catch {
        /* collision, retry */
      }
    }
    return reply.code(500).send({ error: "生成授权码失败，请重试" });
  });

  app.patch("/admin/codes/:id", { preHandler: guard }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = patchCodeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "参数无效" });
    }

    const updates: Partial<typeof licenseCodes.$inferInsert> = {};
    if (parsed.data.status) updates.status = parsed.data.status;
    if (parsed.data.buyerNote !== undefined) updates.buyerNote = parsed.data.buyerNote;
    if (parsed.data.maxDevices) updates.maxDevices = parsed.data.maxDevices;
    if (parsed.data.expiresAt !== undefined) {
      updates.expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null;
    }

    const updated = await db.update(licenseCodes).set(updates).where(eq(licenseCodes.id, id)).returning();
    if (!updated[0]) {
      return reply.code(404).send({ error: "授权码不存在" });
    }
    return { license: updated[0] };
  });

  app.get("/admin/codes/:id/sessions", { preHandler: guard }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const rows = await db
      .select()
      .from(sessions)
      .where(eq(sessions.licenseCodeId, id))
      .orderBy(desc(sessions.lastSeenAt));
    return { sessions: rows };
  });

  app.delete("/admin/sessions/:id", { preHandler: guard }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const deleted = await db.delete(sessions).where(eq(sessions.id, id)).returning({ id: sessions.id });
    if (!deleted[0]) {
      return reply.code(404).send({ error: "会话不存在" });
    }
    return { ok: true };
  });

  app.post("/admin/codes/:id/revoke-all", { preHandler: guard }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await db.delete(sessions).where(eq(sessions.licenseCodeId, id));
    return { ok: true };
  });

  app.get("/admin/logs", { preHandler: guard }, async (request) => {
    const limit = Math.min(Number((request.query as { limit?: string }).limit ?? 100), 200);
    const rows = await db
      .select({
        log: activationLogs,
        codePrefix: licenseCodes.codePrefix,
        buyerNote: licenseCodes.buyerNote,
      })
      .from(activationLogs)
      .leftJoin(licenseCodes, eq(activationLogs.licenseCodeId, licenseCodes.id))
      .orderBy(desc(activationLogs.createdAt))
      .limit(limit);
    return {
      logs: rows.map((row) => {
        const metaPrefix =
          row.log.meta && typeof row.log.meta.codePrefix === "string" ? row.log.meta.codePrefix : null;
        return {
          id: row.log.id,
          eventType: row.log.eventType,
          ip: row.log.ip,
          ipLocation: resolveIpLocation(row.log.ip),
          userAgent: row.log.userAgent,
          meta: row.log.meta,
          createdAt: row.log.createdAt,
          codePrefix: row.codePrefix ?? metaPrefix,
          buyerNote: row.buyerNote,
        };
      }),
    };
  });

  app.get("/admin/sessions", { preHandler: guard }, async () => {
    const rows = await db
      .select({
        session: sessions,
        codePrefix: licenseCodes.codePrefix,
        buyerNote: licenseCodes.buyerNote,
        codeStatus: licenseCodes.status,
      })
      .from(sessions)
      .innerJoin(licenseCodes, eq(sessions.licenseCodeId, licenseCodes.id))
      .orderBy(desc(sessions.lastSeenAt));

    const now = new Date();
    const idleCutoff = new Date(now);
    idleCutoff.setDate(idleCutoff.getDate() - config.idleReleaseDays);

    return {
      sessions: rows.map((row) => {
        const active =
          row.codeStatus === "active" &&
          row.session.expiresAt > now &&
          row.session.lastSeenAt > idleCutoff;
        return {
          id: row.session.id,
          licenseCodeId: row.session.licenseCodeId,
          codePrefix: row.codePrefix,
          buyerNote: row.buyerNote,
          deviceId: row.session.deviceId,
          deviceLabel: row.session.deviceLabel,
          lastIp: row.session.lastIp,
          ipLocation: resolveIpLocation(row.session.lastIp),
          expiresAt: row.session.expiresAt,
          lastSeenAt: row.session.lastSeenAt,
          createdAt: row.session.createdAt,
          active,
        };
      }),
    };
  });
}
