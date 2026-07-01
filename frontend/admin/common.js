const API_BASE = "/ptoe/api";

const PAGES = [
  { id: "codes", href: "./", label: "授权码" },
  { id: "sessions", href: "./sessions.html", label: "在线设备" },
  { id: "logs", href: "./logs.html", label: "激活日志" },
];

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
}

function showMessage(el, message) {
  if (!el) return;
  if (message) {
    el.textContent = message;
    el.removeAttribute("hidden");
  } else {
    el.textContent = "";
    el.setAttribute("hidden", "");
  }
}

function mountNav(activeId) {
  const mount = document.getElementById("adminNavMount");
  if (!mount) return;
  mount.innerHTML = `
    <nav class="admin-nav" aria-label="管理后台导航">
      ${PAGES.map(
        (page) =>
          `<a class="admin-nav-link${page.id === activeId ? " is-active" : ""}" href="${page.href}">${page.label}</a>`
      ).join("")}
    </nav>`;
}

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    showLogin();
    throw new Error(data.error || data.message || "请先登录");
  }
  if (!res.ok) {
    throw new Error(data.error || data.message || "请求失败");
  }
  return data;
}

function showLogin() {
  const loginPanel = document.getElementById("loginPanel");
  const dashboardPanel = document.getElementById("dashboardPanel");
  if (loginPanel) loginPanel.hidden = false;
  if (dashboardPanel) dashboardPanel.hidden = true;
}

function showDashboard() {
  const loginPanel = document.getElementById("loginPanel");
  const dashboardPanel = document.getElementById("dashboardPanel");
  if (loginPanel) loginPanel.hidden = true;
  if (dashboardPanel) dashboardPanel.hidden = false;
}

function bindLogin(onSuccess) {
  const adminLoginForm = document.getElementById("adminLoginForm");
  const usernameInput = document.getElementById("usernameInput");
  const passwordInput = document.getElementById("passwordInput");
  const loginError = document.getElementById("loginError");
  const loginButton = document.getElementById("loginButton");

  if (!loginButton || !usernameInput || !passwordInput || !loginError) {
    showMessage(loginError, "登录表单初始化失败，请刷新页面");
    return;
  }

  async function submitLogin() {
    showMessage(loginError, "");
    loginButton.disabled = true;
    const originalLabel = loginButton.textContent;
    loginButton.textContent = "登录中…";

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.value.trim(),
          password: passwordInput.value,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showMessage(loginError, data.message || "登录失败");
        return;
      }
      passwordInput.value = "";
      showDashboard();
      await onSuccess();
    } catch {
      showMessage(loginError, "网络异常，请稍后重试");
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = originalLabel;
    }
  }

  loginButton.addEventListener("click", submitLogin);
  adminLoginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    submitLogin();
  });
}

function bindLogout(onLogout) {
  document.getElementById("logoutButton")?.addEventListener("click", async () => {
    await fetch(`${API_BASE}/admin/logout`, { method: "POST", credentials: "include" });
    showLogin();
    onLogout?.();
  });
}

async function checkSession(onAuth) {
  try {
    const res = await fetch(`${API_BASE}/admin/session/status`, { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (data.authenticated) {
      showDashboard();
      await onAuth();
    } else {
      showLogin();
    }
  } catch {
    showLogin();
  }
}

async function initAdminPage({ page, onReady }) {
  mountNav(page);
  bindLogin(onReady);
  bindLogout();
  await checkSession(onReady);
}

window.AdminShell = {
  api,
  formatDate,
  initAdminPage,
  showMessage,
};

function bootAdminPage(pageId, onReady) {
  initAdminPage({ page: pageId, onReady }).catch((error) => {
    const loginError = document.getElementById("loginError");
    showMessage(loginError, error.message || "页面初始化失败");
  });
}

window.bootAdminPage = bootAdminPage;
