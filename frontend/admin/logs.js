const logsBody = document.getElementById("logsBody");
const adminError = document.getElementById("adminError");

const EVENT_LABELS = {
  login_success: "激活成功",
  login_fail: "激活失败",
  logout: "解绑退出",
};

function showAdminError(message) {
  AdminShell.showMessage(adminError, message);
}

function clearAdminError() {
  AdminShell.showMessage(adminError, "");
}

function formatMeta(meta) {
  if (!meta || typeof meta !== "object") return "—";
  const reason = meta.reason ? `原因：${meta.reason}` : "";
  const deviceId = meta.deviceId ? `设备：${String(meta.deviceId).slice(0, 8)}…` : "";
  return [reason, deviceId].filter(Boolean).join(" / ") || "—";
}

function renderLogs(logs) {
  logsBody.innerHTML = logs
    .map(
      (log) => `
      <tr>
        <td>${AdminShell.formatDate(log.createdAt)}</td>
        <td><span class="tag ${log.eventType === "login_fail" ? "disabled" : "active"}">${EVENT_LABELS[log.eventType] || log.eventType}</span></td>
        <td>${log.codePrefix || "—"}</td>
        <td>${log.buyerNote || "—"}</td>
        <td>${log.ip || "—"}</td>
        <td>${formatMeta(log.meta)}</td>
      </tr>`
    )
    .join("");
}

async function loadLogs() {
  clearAdminError();
  const data = await AdminShell.api("/admin/logs?limit=100");
  renderLogs(data.logs || []);
}

bootAdminPage("logs", loadLogs);
