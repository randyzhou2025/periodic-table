import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { AppConfig } from "./config.js";

export const ADMIN_SESSION_COOKIE = "ptoe_admin_session";
export const ADMIN_COOKIE_PATH = "/ptoe/";

function signAdminPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(`admin:${payload}`).digest("base64url");
}

export function verifyAdminCredentials(username: string, password: string, config: AppConfig): boolean {
  if (username.toLowerCase() !== config.adminUsername.toLowerCase()) {
    return false;
  }
  if (password.length !== config.adminPassword.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(password), Buffer.from(config.adminPassword));
}

export function createAdminSessionToken(config: AppConfig): string {
  const expiresAt = Date.now() + config.adminSessionTtlHours * 60 * 60 * 1000;
  const nonce = randomBytes(16).toString("hex");
  const payload = `${config.adminUsername}.${expiresAt}.${nonce}`;
  const signature = signAdminPayload(payload, config.sessionSecret);
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined, config: AppConfig): boolean {
  if (!token) return false;
  const [payloadPart, signature] = token.split(".");
  if (!payloadPart || !signature) return false;

  const payload = Buffer.from(payloadPart, "base64url").toString("utf8");
  const expected = signAdminPayload(payload, config.sessionSecret);
  if (signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  const [username, expiresAtRaw] = payload.split(".");
  if (username !== config.adminUsername) return false;
  if (Number(expiresAtRaw) <= Date.now()) return false;
  return true;
}

export function readAdminSessionCookie(request: FastifyRequest): string | undefined {
  const cookies = request.cookies as Record<string, string | undefined>;
  return cookies[ADMIN_SESSION_COOKIE];
}

export function setAdminSessionCookie(reply: FastifyReply, token: string, config: AppConfig): void {
  reply.setCookie(ADMIN_SESSION_COOKIE, token, {
    path: ADMIN_COOKIE_PATH,
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: "lax",
    maxAge: config.adminSessionTtlHours * 60 * 60,
  });
}

export function clearAdminSessionCookie(reply: FastifyReply): void {
  reply.clearCookie(ADMIN_SESSION_COOKIE, { path: ADMIN_COOKIE_PATH });
}
