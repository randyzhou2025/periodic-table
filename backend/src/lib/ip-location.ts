import geoip from "geoip-lite";

const COUNTRY_ZH: Record<string, string> = {
  CN: "中国",
  HK: "中国香港",
  MO: "中国澳门",
  TW: "中国台湾",
  US: "美国",
  JP: "日本",
  SG: "新加坡",
  KR: "韩国",
};

function isPrivateOrLocalIp(ip: string): boolean {
  if (!ip || ip === "unknown") {
    return true;
  }
  if (ip === "::1" || ip.startsWith("fe80:") || ip.startsWith("fc") || ip.startsWith("fd")) {
    return true;
  }
  if (ip.startsWith("127.")) {
    return true;
  }

  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
    return false;
  }

  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  return false;
}

export function resolveIpLocation(ip: string): string {
  if (!ip || ip === "unknown") {
    return "—";
  }
  if (isPrivateOrLocalIp(ip)) {
    return "局域网";
  }

  const hit = geoip.lookup(ip);
  if (!hit) {
    return "未知";
  }

  const country = COUNTRY_ZH[hit.country] ?? hit.country;
  const parts = [country, hit.region, hit.city].filter((part) => part && part.trim());
  return parts.length ? parts.join(" · ") : "未知";
}
