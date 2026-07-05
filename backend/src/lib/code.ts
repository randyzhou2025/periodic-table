import { randomBytes } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function normalizeLicenseCode(input: string): string | null {
  const stripped = input.trim().replace(/[\s-]+/g, "").toUpperCase();
  if (!stripped.startsWith("PTOE")) {
    return null;
  }
  const suffix = stripped.slice(4);
  if (suffix.length !== 8 || !/^[A-Z0-9]{8}$/.test(suffix)) {
    return null;
  }
  return `PTOE${suffix}`;
}

export function formatLicenseCode(normalized: string): string {
  const suffix = normalized.slice(4);
  return `PTOE-${suffix.slice(0, 4)}-${suffix.slice(4)}`;
}

/** 从用户输入提取可展示的前缀（失败日志用，允许不完整授权码） */
export function codePrefixFromInput(input: string): string | null {
  const stripped = input.trim().replace(/[\s-]+/g, "").toUpperCase();
  if (!stripped.startsWith("PTOE")) {
    return null;
  }
  const suffix = stripped.slice(4).replace(/[^A-Z0-9]/g, "");
  if (!suffix) {
    return "PTOE-";
  }
  return `PTOE-${suffix.slice(0, 4)}`;
}

export function generateLicenseCode(): { normalized: string; formatted: string } {
  let suffix = "";
  for (let i = 0; i < 8; i += 1) {
    suffix += ALPHABET[randomBytes(1)[0]! % ALPHABET.length];
  }
  const normalized = `PTOE${suffix}`;
  return { normalized, formatted: formatLicenseCode(normalized) };
}
