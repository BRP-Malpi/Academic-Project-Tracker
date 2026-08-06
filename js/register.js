function loadDepartments() {
  const depts = [
    "Computer Science & IT", "Electronics & Communication", "Civil Engineering",
    "Mechanical Engineering", "Electrical Engineering", "Environmental Science", "Physics"
  ];
  const sel = document.getElementById("department");
  if (sel) {
    sel.innerHTML = '<option value="">Select Department</option>' + depts.map(d => `<option value="${d}">${d}</option>`).join("");
  }
}

document.getElementById("registerForm").onsubmit = async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const dob = document.getElementById("dob").value;
  const department = document.getElementById("department").value;
  const role = document.querySelector('input[name="role"]:checked').value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPass").value;
  const agree = document.getElementById("agreeTerms").checked;
  const msg = document.getElementById("regMsg");

  if (!username || username.length < 3) {
    msg.innerHTML = '<div class="alert alert-error">Username must be at least 3 characters.</div>';
    return;
  }
  if (!email || !email.includes("@")) {
    msg.innerHTML = '<div class="alert alert-error">Enter a valid email address.</div>';
    return;
  }
  if (!department) {
    msg.innerHTML = '<div class="alert alert-error">Please select a department.</div>';
    return;
  }
  if (!password || password.length < 6 || password !== confirm) {
    msg.innerHTML = '<div class="alert alert-error">Passwords must match and be at least 6 characters.</div>';
    return;
  }
  if (!agree) {
    msg.innerHTML = '<div class="alert alert-error">You must agree to the policy.</div>';
    return;
  }

  const existing = await getUserByUsername(username);
  if (existing) {
    msg.innerHTML = '<div class="alert alert-error">Username is already taken.</div>';
    return;
  }

  const userId = await addUser({ username, email, phone, dob, department, role, password });
  await setSession({ id: userId, username, role });

  msg.innerHTML = `<div class="alert alert-success">Welcome, ${username}! Redirecting...</div>`;
  setTimeout(() => { window.location.href = "index.html"; }, 1000);
};

loadDepartments();
