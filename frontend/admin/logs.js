const logsBody = document.getElementById("logsBody");
const logsPagination = document.getElementById("logsPagination");
const adminError = document.getElementById("adminError");
const PAGE_SIZE = 20;

let currentPage = 1;

const EVENT_LABELS = {
  login_success: "激活成功",
  login_fail: "激活失败",
  logout: "解绑退出",
};

const EVENT_TAG_CLASS = {
  login_success: "success",
  login_fail: "fail",
  logout: "neutral",
};

const REASON_LABELS = {
  invalid_format: "授权码格式无效",
  invalid_or_disabled: "授权码无效或已停用",
  code_expired: "授权码已过期",
  device_limit: "设备位已满",
  self_unbind: "用户自助解绑",
};

function showAdminError(message) {
  AdminShell.showMessage(adminError, message);
}

function clearAdminError() {
  AdminShell.showMessage(adminError, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDetails(log) {
  const meta = log.meta;
  const parts = [];

  if (meta && typeof meta === "object") {
    if (meta.reason) {
      const reason = REASON_LABELS[meta.reason] || meta.reason;
      parts.push(`原因：${reason}`);
    }
    if (meta.devicesUsed != null && meta.devicesMax != null) {
      parts.push(`设备占用：${meta.devicesUsed}/${meta.devicesMax}`);
    }
    if (meta.deviceLabel) parts.push(`设备：${meta.deviceLabel}`);
    if (meta.deviceId) parts.push(`设备 ID：${meta.deviceId}`);
    if (meta.screen) parts.push(`屏幕：${meta.screen}`);
    if (meta.platform) parts.push(`平台：${meta.platform}`);
    if (meta.language) parts.push(`语言：${meta.language}`);
    if (meta.timezone) parts.push(`时区：${meta.timezone}`);
  }

  if (log.userAgent) {
    parts.push(`UA：${log.userAgent}`);
  }

  return parts.length ? parts.join("\n") : "—";
}

function renderLogs(logs) {
  logsBody.innerHTML = logs
    .map(
      (log) => `
      <tr>
        <td>${AdminShell.formatDate(log.createdAt)}</td>
        <td class="log-event"><span class="tag ${EVENT_TAG_CLASS[log.eventType] || "neutral"}">${EVENT_LABELS[log.eventType] || log.eventType}</span></td>
        <td>${escapeHtml(log.codePrefix || "—")}</td>
        <td>${escapeHtml(log.buyerNote || "—")}</td>
        <td>${escapeHtml(log.ip || "—")}</td>
        <td class="log-location">${escapeHtml(log.ipLocation || "—")}</td>
        <td class="log-details">${escapeHtml(formatDetails(log))}</td>
      </tr>`
    )
    .join("");
}

async function loadLogs(page = currentPage) {
  clearAdminError();
  currentPage = page;
  const data = await AdminShell.api(`/admin/logs?page=${page}&limit=${PAGE_SIZE}`);
  const logs = data.logs || [];
  renderLogs(logs);
  AdminShell.renderPagination(logsPagination, data.pagination, loadLogs);
  if (logs.length === 0 && page > 1) {
    await loadLogs(page - 1);
  }
}

bootAdminPage("logs", () => loadLogs(1));
