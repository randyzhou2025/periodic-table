export function clientIpFromRequest(headers: Record<string, unknown>, fallback?: string): string {
  const forwarded = headers["x-forwarded-for"] ?? headers["X-Forwarded-For"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]!.trim();
  }
  const realIp = headers["x-real-ip"] ?? headers["X-Real-IP"];
  if (typeof realIp === "string" && realIp.length > 0) {
    return realIp.trim();
  }
  return fallback ?? "unknown";
}
