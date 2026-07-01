const createCodeButton = document.getElementById("createCodeButton");
const buyerNoteInput = document.getElementById("buyerNoteInput");
const codesBody = document.getElementById("codesBody");
const adminError = document.getElementById("adminError");
const newCodeBox = document.getElementById("newCodeBox");

function showAdminError(message) {
  AdminShell.showMessage(adminError, message);
}

function clearAdminError() {
  AdminShell.showMessage(adminError, "");
}

function renderCodes(codes) {
  codesBody.innerHTML = codes
    .map(
      (code) => `
      <tr>
        <td>${code.codePrefix}</td>
        <td><span class="tag ${code.status}">${code.status === "active" ? "启用" : "停用"}</span></td>
        <td>${code.activeSessions}/${code.maxDevices}</td>
        <td>${code.buyerNote || "—"}</td>
        <td>${AdminShell.formatDate(code.createdAt)}</td>
        <td>
          <div class="actions">
            <button type="button" data-action="toggle" data-id="${code.id}" data-status="${code.status}">
              ${code.status === "active" ? "停用" : "启用"}
            </button>
            <button type="button" data-action="revoke" data-id="${code.id}">撤销全部会话</button>
          </div>
        </td>
      </tr>`
    )
    .join("");
}

async function loadCodes() {
  clearAdminError();
  const data = await AdminShell.api("/admin/codes");
  renderCodes(data.codes || []);
}

async function createCode() {
  clearAdminError();
  const data = await AdminShell.api("/admin/codes", {
    method: "POST",
    body: JSON.stringify({ buyerNote: buyerNoteInput.value.trim() || undefined }),
  });
  newCodeBox.hidden = false;
  newCodeBox.textContent = `新授权码（请立即复制）：${data.code}`;
  buyerNoteInput.value = "";
  await loadCodes();
}

async function handleTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = button.dataset.id;
  const action = button.dataset.action;
  clearAdminError();

  try {
    if (action === "toggle") {
      const nextStatus = button.dataset.status === "active" ? "disabled" : "active";
      await AdminShell.api(`/admin/codes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
    } else if (action === "revoke") {
      await AdminShell.api(`/admin/codes/${id}/revoke-all`, { method: "POST" });
    }
    await loadCodes();
  } catch (error) {
    showAdminError(error.message);
  }
}

createCodeButton?.addEventListener("click", async () => {
  try {
    await createCode();
  } catch (error) {
    showAdminError(error.message);
  }
});

codesBody?.addEventListener("click", handleTableClick);

bootAdminPage("codes", loadCodes);
