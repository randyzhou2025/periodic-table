const API_BASE = "/ptoe/api";
const DEVICE_KEY = "ptoe_device_id";

const form = document.getElementById("loginForm");
const codeInput = document.getElementById("codeInput");
const errorBox = document.getElementById("errorBox");
const deviceUsage = document.getElementById("deviceUsage");
const submitButton = document.getElementById("submitButton");
const logoutButton = document.getElementById("logoutButton");
const maxDevicesEl = document.getElementById("maxDevices");
const contactWechatEl = document.getElementById("contactWechat");
const contactEmailEl = document.getElementById("contactEmail");

function getDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

function getNextPath() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");
  if (next && next.startsWith("/ptoe/") && !next.startsWith("/ptoe/login")) {
    return next;
  }
  return "/ptoe/";
}

function showError(message) {
  errorBox.hidden = false;
  errorBox.textContent = message;
}

function clearError() {
  errorBox.hidden = true;
  errorBox.textContent = "";
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
  if (data.contactWechat) contactWechatEl.textContent = data.contactWechat;
  if (data.contactEmail) {
    contactEmailEl.textContent = data.contactEmail;
    contactEmailEl.href = `mailto:${data.contactEmail}`;
  }
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
  deviceUsage.hidden = true;
  logoutButton.hidden = true;
  clearError();
  showError("已解除本机绑定，可重新输入授权码。");
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();
  submitButton.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: codeInput.value,
        deviceId: getDeviceId(),
        deviceLabel: navigator.userAgent.slice(0, 120),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (data.devicesUsed != null && data.devicesMax != null) {
        deviceUsage.hidden = false;
        deviceUsage.textContent = `当前已用 ${data.devicesUsed}/${data.devicesMax} 台设备`;
        logoutButton.hidden = false;
      }
      showError(data.message || "激活失败，请稍后重试");
      return;
    }

    if (data.devicesUsed != null && data.devicesMax != null) {
      deviceUsage.hidden = false;
      deviceUsage.textContent = `已绑定 ${data.devicesUsed}/${data.devicesMax} 台设备`;
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
});

logoutButton?.addEventListener("click", logoutCurrentDevice);

loadPublicConfig();
checkExistingSession();
