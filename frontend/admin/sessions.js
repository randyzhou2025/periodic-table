const sessionsBody = document.getElementById("sessionsBody");
const sessionsPagination = document.getElementById("sessionsPagination");
const adminError = document.getElementById("adminError");
const PAGE_SIZE = 100;

let currentPage = 1;

function showAdminError(message) {
  AdminShell.showMessage(adminError, message);
}

function clearAdminError() {
  AdminShell.showMessage(adminError, "");
}

function shortId(value) {
  if (!value) return "—";
  return value.length > 10 ? `${value.slice(0, 8)}…` : value;
}

function renderSessions(rows) {
  sessionsBody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td><span class="tag ${row.active ? "active" : "disabled"}">${row.active ? "在线" : "已失效"}</span></td>
        <td>${row.codePrefix}</td>
        <td>${row.buyerNote || "—"}</td>
        <td title="${row.deviceId}">${shortId(row.deviceId)}</td>
        <td>${row.lastIp || "—"}</td>
        <td class="log-location">${row.ipLocation || "—"}</td>
        <td>${AdminShell.formatDate(row.lastSeenAt)}</td>
        <td>${AdminShell.formatDate(row.expiresAt)}</td>
        <td>
          <div class="actions">
            <button type="button" data-action="revoke-session" data-id="${row.id}">强制解绑</button>
          </div>
        </td>
      </tr>`
    )
    .join("");
}

async function loadSessions(page = currentPage) {
  clearAdminError();
  currentPage = page;
  const data = await AdminShell.api(`/admin/sessions?page=${page}&limit=${PAGE_SIZE}`);
  const sessions = data.sessions || [];
  renderSessions(sessions);
  AdminShell.renderPagination(sessionsPagination, data.pagination, loadSessions);
  if (sessions.length === 0 && page > 1) {
    await loadSessions(page - 1);
  }
}

async function handleTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  clearAdminError();

  try {
    if (button.dataset.action === "revoke-session") {
      await AdminShell.api(`/admin/sessions/${button.dataset.id}`, { method: "DELETE" });
      await loadSessions(currentPage);
    }
  } catch (error) {
    showAdminError(error.message);
  }
}

sessionsBody?.addEventListener("click", handleTableClick);

bootAdminPage("sessions", () => loadSessions(1));
