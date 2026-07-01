import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";

export function hashSessionToken(token: string, secret: string): string {
  return createHmac("sha256", secret).update(token).digest("hex");
}

export function hashLicenseCode(normalizedCode: string, secret: string): string {
  return createHmac("sha256", secret).update(`license:${normalizedCode}`).digest("hex");
}

export function createSessionToken(): string {
  return randomUUID().replace(/-/g, "") + randomBytes(16).toString("hex");
}

export function codePrefixFromNormalized(normalized: string): string {
  const suffix = normalized.slice(4);
  return `PTOE-${suffix.slice(0, 4)}`;
}

export function sha256Short(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}
