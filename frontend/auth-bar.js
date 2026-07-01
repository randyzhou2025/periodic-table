const API_BASE = "/ptoe/api";

const usageEl = document.getElementById("authDeviceUsage");
const logoutButton = document.getElementById("authLogoutButton");

async function refreshAuthBar() {
  try {
    const res = await fetch(`${API_BASE}/session/status`, { credentials: "include" });
    const data = await res.json();
    if (!data.authenticated) {
      window.location.replace(`/ptoe/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (usageEl && data.devicesUsed != null && data.devicesMax != null) {
      usageEl.textContent = `已绑定 ${data.devicesUsed}/${data.devicesMax} 台设备`;
    }
  } catch {
    /* ignore */
  }
}

logoutButton?.addEventListener("click", async () => {
  await fetch(`${API_BASE}/logout`, { method: "POST", credentials: "include" });
  window.location.replace("/ptoe/login");
});

refreshAuthBar();
