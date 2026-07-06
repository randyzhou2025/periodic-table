const createCodeButton = document.getElementById("createCodeButton");
const buyerNoteInput = document.getElementById("buyerNoteInput");
const codesBody = document.getElementById("codesBody");
const codesPagination = document.getElementById("codesPagination");
const adminError = document.getElementById("adminError");
const newCodeBox = document.getElementById("newCodeBox");
const PAGE_SIZE = 100;

let currentPage = 1;

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

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function showNewCode(code) {
  newCodeBox.hidden = false;
  newCodeBox.innerHTML = `
    <span class="new-code-label">新授权码（请立即复制）：</span>
    <code class="new-code-value">${escapeHtml(code)}</code>
    <button type="button" class="copy-code-button" data-code="${escapeHtml(code)}">复制</button>
  `;
}

newCodeBox?.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy-code-button");
  if (!button) return;

  const code = button.dataset.code;
  if (!code) return;

  const originalLabel = button.textContent;
  try {
    await copyText(code);
    button.textContent = "已复制";
    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1800);
  } catch {
    showAdminError("复制失败，请手动选中授权码复制");
  }
});

function renderCodes(codes) {
  codesBody.innerHTML = codes
    .map(
      (code) => `
      <tr>
        <td>${code.codePrefix}</td>
        <td><span class="tag ${code.status}">${code.status === "active" ? "启用" : "停用"}</span></td>
        <td>${code.activeSessions}/${code.maxDevices}</td>
        <td>
          <input
            class="note-input"
            type="text"
            data-id="${code.id}"
            data-original="${escapeHtml(code.buyerNote || "")}"
            value="${escapeHtml(code.buyerNote || "")}"
            placeholder="添加备注"
            maxlength="255"
          />
        </td>
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

async function loadCodes(page = currentPage) {
  clearAdminError();
  currentPage = page;
  const data = await AdminShell.api(`/admin/codes?page=${page}&limit=${PAGE_SIZE}`);
  const codes = data.codes || [];
  renderCodes(codes);
  AdminShell.renderPagination(codesPagination, data.pagination, loadCodes);
  if (codes.length === 0 && page > 1) {
    await loadCodes(page - 1);
  }
}

async function createCode() {
  clearAdminError();
  const data = await AdminShell.api("/admin/codes", {
    method: "POST",
    body: JSON.stringify({ buyerNote: buyerNoteInput.value.trim() || undefined }),
  });
  showNewCode(data.code);
  buyerNoteInput.value = "";
  await loadCodes(1);
}

async function saveBuyerNote(input) {
  const id = input.dataset.id;
  const buyerNote = input.value.trim();
  const original = input.dataset.original ?? "";
  if (buyerNote === original) return;

  input.disabled = true;
  try {
    await AdminShell.api(`/admin/codes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ buyerNote: buyerNote || null }),
    });
    input.dataset.original = buyerNote;
    clearAdminError();
  } catch (error) {
    input.value = original;
    showAdminError(error.message);
  } finally {
    input.disabled = false;
  }
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
    await loadCodes(currentPage);
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

codesBody?.addEventListener("focusout", (event) => {
  const input = event.target.closest(".note-input");
  if (!input) return;
  saveBuyerNote(input);
});

codesBody?.addEventListener("keydown", (event) => {
  const input = event.target.closest(".note-input");
  if (!input || event.key !== "Enter") return;
  event.preventDefault();
  input.blur();
});

bootAdminPage("codes", () => loadCodes(1));
