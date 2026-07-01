import { and, eq, gt, sql } from "drizzle-orm";
import type { FastifyReply } from "fastify";
import { db } from "../db/index.js";
import { activationLogs, licenseCodes, sessions } from "../db/schema.js";
import type { AppConfig } from "./config.js";
import { COOKIE_PATH, SESSION_COOKIE } from "./config.js";
import { createSessionToken, hashSessionToken } from "./hash.js";

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isSessionIdle(lastSeenAt: Date, idleReleaseDays: number): boolean {
  const cutoff = addDays(new Date(), -idleReleaseDays);
  return lastSeenAt < cutoff;
}

export async function countActiveSessions(licenseCodeId: string, config: AppConfig): Promise<number> {
  const idleCutoff = addDays(new Date(), -config.idleReleaseDays);
  const now = new Date();
  const rows = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(
      and(
        eq(sessions.licenseCodeId, licenseCodeId),
        gt(sessions.expiresAt, now),
        gt(sessions.lastSeenAt, idleCutoff)
      )
    );
  return rows.length;
}

export async function logActivation(
  licenseCodeId: string | null,
  eventType: string,
  ip: string,
  userAgent: string | undefined,
  meta?: Record<string, unknown>
): Promise<void> {
  await db.insert(activationLogs).values({
    licenseCodeId,
    eventType,
    ip,
    userAgent: userAgent?.slice(0, 512),
    meta,
  });
}

export function setSessionCookie(reply: FastifyReply, token: string, expiresAt: Date, secure: boolean): void {
  reply.setCookie(SESSION_COOKIE, token, {
    path: COOKIE_PATH,
    httpOnly: true,
    secure,
    sameSite: "lax",
    expires: expiresAt,
  });
}

export function clearSessionCookie(reply: FastifyReply): void {
  reply.clearCookie(SESSION_COOKIE, { path: COOKIE_PATH });
}

export async function createOrRefreshSession(params: {
  licenseCodeId: string;
  deviceId: string;
  deviceLabel?: string;
  ip: string;
  config: AppConfig;
}): Promise<{ token: string; expiresAt: Date; sessionId: string }> {
  const { licenseCodeId, deviceId, deviceLabel, ip, config } = params;
  const now = new Date();
  const expiresAt = addDays(now, config.sessionTtlDays);

  const existing = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.licenseCodeId, licenseCodeId), eq(sessions.deviceId, deviceId)))
    .limit(1);

  const token = createSessionToken();
  const sessionTokenHash = hashSessionToken(token, config.sessionSecret);

  if (existing[0]) {
    await db
      .update(sessions)
      .set({
        sessionTokenHash,
        deviceLabel: deviceLabel ?? existing[0].deviceLabel,
        lastIp: ip,
        expiresAt,
        lastSeenAt: now,
      })
      .where(eq(sessions.id, existing[0].id));
    return { token, expiresAt, sessionId: existing[0].id };
  }

  const inserted = await db
    .insert(sessions)
    .values({
      licenseCodeId,
      sessionTokenHash,
      deviceId,
      deviceLabel,
      lastIp: ip,
      expiresAt,
      lastSeenAt: now,
    })
    .returning({ id: sessions.id });

  return { token, expiresAt, sessionId: inserted[0]!.id };
}

export async function resolveSessionFromCookie(
  cookieToken: string | undefined,
  config: AppConfig,
  ip?: string
): Promise<
  | { ok: true; sessionId: string; licenseCodeId: string }
  | { ok: false; reason: "missing" | "invalid" | "expired" | "idle" | "disabled" }
> {
  if (!cookieToken) {
    return { ok: false, reason: "missing" };
  }

  const sessionTokenHash = hashSessionToken(cookieToken, config.sessionSecret);
  const row = await db
    .select({
      session: sessions,
      license: licenseCodes,
    })
    .from(sessions)
    .innerJoin(licenseCodes, eq(sessions.licenseCodeId, licenseCodes.id))
    .where(eq(sessions.sessionTokenHash, sessionTokenHash))
    .limit(1);

  const match = row[0];
  if (!match) {
    return { ok: false, reason: "invalid" };
  }

  const now = new Date();
  if (match.license.status !== "active") {
    await db.delete(sessions).where(eq(sessions.id, match.session.id));
    return { ok: false, reason: "disabled" };
  }

  if (match.license.expiresAt && match.license.expiresAt <= now) {
    await db.delete(sessions).where(eq(sessions.id, match.session.id));
    return { ok: false, reason: "expired" };
  }

  if (match.session.expiresAt <= now) {
    await db.delete(sessions).where(eq(sessions.id, match.session.id));
    return { ok: false, reason: "expired" };
  }

  if (isSessionIdle(match.session.lastSeenAt, config.idleReleaseDays)) {
    await db.delete(sessions).where(eq(sessions.id, match.session.id));
    return { ok: false, reason: "idle" };
  }

  await db
    .update(sessions)
    .set({
      lastSeenAt: now,
      lastIp: ip ?? match.session.lastIp,
    })
    .where(eq(sessions.id, match.session.id));

  return {
    ok: true,
    sessionId: match.session.id,
    licenseCodeId: match.session.licenseCodeId,
  };
}

export async function deleteSessionByToken(cookieToken: string | undefined, config: AppConfig): Promise<boolean> {
  if (!cookieToken) {
    return false;
  }
  const sessionTokenHash = hashSessionToken(cookieToken, config.sessionSecret);
  const deleted = await db.delete(sessions).where(eq(sessions.sessionTokenHash, sessionTokenHash)).returning({ id: sessions.id });
  return deleted.length > 0;
}

export async function getSessionUsage(licenseCodeId: string, config: AppConfig): Promise<{ used: number; max: number }> {
  const license = await db.select().from(licenseCodes).where(eq(licenseCodes.id, licenseCodeId)).limit(1);
  const max = license[0]?.maxDevices ?? config.maxDevicesDefault;
  const used = await countActiveSessions(licenseCodeId, config);
  return { used, max };
}
