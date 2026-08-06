async function requireLogin(redirectTo) {
  const session = await getSession();
  if (!session) {
    window.location.href = redirectTo || "login.html";
    return null;
  }
  return session;
}

async function updateNavForSession() {
  const session = await getSession();
  const loginLink = document.querySelector('a[href="login.html"]');
  const registerLink = document.querySelector('a[href="register.html"]');

  if (!session) return null;

  if (loginLink) loginLink.style.display = "none";
  if (registerLink) registerLink.style.display = "none";

  const nav = document.querySelector("nav.site-nav");
  if (nav && !document.getElementById("session-bar")) {
    const bar = document.createElement("div");
    bar.id = "session-bar";
    bar.style.cssText = "font-size:0.75rem; color:#94a3b8; display:flex; align-items:center; gap:8px;";
    bar.innerHTML = `<span>${session.username} (${session.role})</span> <a href="#" id="logoutBtn" style="color:var(--accent); font-weight:600;">Logout</a>`;
    nav.parentElement.appendChild(bar);

    document.getElementById("logoutBtn").onclick = async (e) => {
      e.preventDefault();
      await clearSession();
      window.location.href = "login.html";
    };
  }

  return session;
}
