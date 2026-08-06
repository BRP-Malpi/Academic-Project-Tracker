document.getElementById("loginForm").onsubmit = async (e) => {
  e.preventDefault();

  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value;
  const msg = document.getElementById("loginMsg");

  if (!username || !password) {
    msg.innerHTML = '<div class="alert alert-error">Please fill in both username and password.</div>';
    return;
  }

  const user = await getUserByUsername(username);
  if (!user || user.password !== password) {
    msg.innerHTML = '<div class="alert alert-error">Incorrect username or password.</div>';
    return;
  }

  await setSession(user);
  window.location.href = "index.html";
};
