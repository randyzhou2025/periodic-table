export const SESSION_COOKIE = "ptoe_session";
export const COOKIE_PATH = "/ptoe/";

export function loadConfig() {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters");
  }

  const adminUsername = process.env.ADMIN_USERNAME?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminUsername) {
    throw new Error("ADMIN_USERNAME is required");
  }
  if (!adminPassword || adminPassword.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  }

  return {
    sessionSecret,
    adminUsername,
    adminPassword,
    adminSessionTtlHours: Number(process.env.ADMIN_SESSION_TTL_HOURS ?? 24),
    sessionTtlDays: Number(process.env.SESSION_TTL_DAYS ?? 90),
    maxDevicesDefault: Number(process.env.MAX_DEVICES_DEFAULT ?? 1),
    idleReleaseDays: Number(process.env.IDLE_RELEASE_DAYS ?? 30),
    loginRateLimit: Number(process.env.LOGIN_RATE_LIMIT ?? 5),
    contactWechat: process.env.CONTACT_WECHAT ?? "请联系客服微信（待配置）",
    contactEmail: process.env.CONTACT_EMAIL ?? "support@example.com",
    cookieSecure: process.env.COOKIE_SECURE !== "false",
  };
}

export type AppConfig = ReturnType<typeof loadConfig>;
