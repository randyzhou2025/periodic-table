const API_BASE = "/ptoe/api";
const DEVICE_KEY = "ptoe_device_id";

const form = document.getElementById("loginForm");
const codeInput = document.getElementById("codeInput");
const errorBox = document.getElementById("errorBox");
const errorPanel = document.getElementById("errorPanel");
const deviceUsage = document.getElementById("deviceUsage");
const submitButton = document.getElementById("submitButton");
const logoutButton = document.getElementById("logoutButton");
const loginHelpLead = document.getElementById("loginHelpLead");
const unbindHelpButton = document.getElementById("unbindHelpButton");
const selfUnbindButton = document.getElementById("selfUnbindButton");
const unbindHelpDialog = document.getElementById("unbindHelpDialog");
const maxDevicesEl = document.getElementById("maxDevices");
const contactWechatEl = document.getElementById("contactWechat");
const contactEmailEl = document.getElementById("contactEmail");

const DEFAULT_HELP = "激活遇到问题？可通过以下方式联系管理员：";

function createDeviceId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = createDeviceId();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

function collectDeviceInfo() {
  return {
    screen: `${window.screen.width}x${window.screen.height}@${window.devicePixelRatio || 1}`,
    platform: navigator.userAgentData?.platform || navigator.platform || "",
    language: navigator.language || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
  };
}

function buildDeviceLabel() {
  const ua = navigator.userAgent;
  let device = "未知设备";
  if (/iPhone/i.test(ua)) device = "iPhone";
  else if (/iPad/i.test(ua)) device = "iPad";
  else if (/Android/i.test(ua)) device = "Android";
  else if (/Mac/i.test(ua)) device = "Mac";
  else if (/Windows/i.test(ua)) device = "Windows";

  const info = collectDeviceInfo();
  return `${device} · ${info.screen} · ${info.language}`.slice(0, 255);
}

function getNextPath() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");
  if (next && next.startsWith("/ptoe/") && !next.startsWith("/ptoe/login")) {
    return next;
  }
  return "/ptoe/";
}

function showError(message, options = {}) {
  errorPanel.hidden = false;
  errorBox.textContent = message;
  unbindHelpButton.hidden = !options.showUnbindHelp;
  selfUnbindButton.hidden = !options.showSelfUnbind;
}

function clearError() {
  errorPanel.hidden = true;
  errorBox.textContent = "";
  unbindHelpButton.hidden = true;
  selfUnbindButton.hidden = true;
}

function resetLoginHelp() {
  if (loginHelpLead) loginHelpLead.textContent = DEFAULT_HELP;
  deviceUsage.hidden = true;
  logoutButton.hidden = true;
  clearError();
}

function formatCodeInput(value) {
  const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  let body = raw.startsWith("PTOE") ? raw.slice(4) : raw;
  body = body.slice(0, 8);
  if (body.length <= 4) {
    return body ? `PTOE-${body}` : raw.startsWith("PTOE") ? "PTOE-" : "";
  }
  return `PTOE-${body.slice(0, 4)}-${body.slice(4)}`;
}

async function loadPublicConfig() {
  const res = await fetch(`${API_BASE}/config/public`, { credentials: "include" });
  if (!res.ok) return;
  const data = await res.json();
  if (data.maxDevicesDefault) maxDevicesEl.textContent = String(data.maxDevicesDefault);
  if (data.contactWechat && contactWechatEl) contactWechatEl.textContent = data.contactWechat;
  if (data.contactEmail) {
    contactEmailEl.textContent = data.contactEmail;
    contactEmailEl.href = `mailto:${data.contactEmail}`;
  }
}

async function waitForAuthenticatedSession(maxAttempts = 6) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const res = await fetch(`${API_BASE}/session/status`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated) {
        return true;
      }
    }
    await new Promise((resolve) => {
      window.setTimeout(resolve, 80 * (attempt + 1));
    });
  }
  return false;
}

async function checkExistingSession() {
  const res = await fetch(`${API_BASE}/session/status`, { credentials: "include" });
  if (!res.ok) return;
  const data = await res.json();
  if (data.authenticated) {
    window.location.replace(getNextPath());
    return;
  }
}

async function logoutCurrentDevice() {
  await fetch(`${API_BASE}/logout`, { method: "POST", credentials: "include" });
  resetLoginHelp();
  clearError();
  showError("已解除本机绑定，可重新输入授权码。");
}

async function unbindByCode() {
  const code = codeInput.value.trim();
  if (!code) {
    showError("请先填写授权码", { showSelfUnbind: true });
    return;
  }

  const confirmed = window.confirm(
    "将解除该授权码下的设备绑定（若本机未成功登录，也会清除服务器上的占用记录）。解绑后请重新点击「激活并进入」。确定继续？"
  );
  if (!confirmed) return;

  selfUnbindButton.disabled = true;
  const originalLabel = selfUnbindButton.textContent;
  selfUnbindButton.textContent = "解绑中…";

  try {
    const res = await fetch(`${API_BASE}/unbind-self`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        deviceId: getDeviceId(),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showError(data.message || "解绑失败，请稍后重试", { showSelfUnbind: true, showUnbindHelp: true });
      return;
    }

    deviceUsage.hidden = true;
    showError(
      data.cleared > 0
        ? "已解除设备绑定，请重新点击「激活并进入」。"
        : "当前没有已绑定的设备，请直接重新激活。"
    );
  } catch {
    showError("网络异常，请检查连接后重试", { showSelfUnbind: true, showUnbindHelp: true });
  } finally {
    selfUnbindButton.disabled = false;
    selfUnbindButton.textContent = originalLabel;
  }
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  resetLoginHelp();
  submitButton.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: codeInput.value,
        deviceId: getDeviceId(),
        deviceLabel: buildDeviceLabel(),
        deviceInfo: collectDeviceInfo(),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (data.code === "DEVICE_LIMIT") {
        if (data.devicesUsed != null && data.devicesMax != null) {
          deviceUsage.hidden = false;
          deviceUsage.textContent = `当前已用 ${data.devicesUsed}/${data.devicesMax} 台设备`;
        }
        logoutButton.hidden = true;
        showError(data.message || "激活失败，请稍后重试", {
          showUnbindHelp: true,
          showSelfUnbind: true,
        });
      } else {
        showError(data.message || "激活失败，请稍后重试");
      }
      return;
    }

    if (data.devicesUsed != null && data.devicesMax != null) {
      deviceUsage.hidden = false;
      deviceUsage.textContent = `已绑定 ${data.devicesUsed}/${data.devicesMax} 台设备`;
    }

    const sessionReady = await waitForAuthenticatedSession();
    if (!sessionReady) {
      showError(
        "激活已成功，但浏览器未能保存登录状态。建议使用 Chrome 浏览器访问；并请检查是否开启 Cookie、关闭无痕/隐私模式，或尝试关闭「阻止跨站跟踪」后重试。也可点击下方「解除授权码设备绑定」后重新激活。",
        { showSelfUnbind: true }
      );
      return;
    }

    window.location.replace(getNextPath());
  } catch {
    showError("网络异常，请检查连接后重试");
  } finally {
    submitButton.disabled = false;
  }
});

codeInput?.addEventListener("input", () => {
  codeInput.value = formatCodeInput(codeInput.value);
  resetLoginHelp();
});

logoutButton?.addEventListener("click", logoutCurrentDevice);

selfUnbindButton?.addEventListener("click", unbindByCode);

unbindHelpButton?.addEventListener("click", () => {
  unbindHelpDialog?.showModal();
});

loadPublicConfig();
checkExistingSession();
