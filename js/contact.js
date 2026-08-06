document.getElementById("contactForm").onsubmit = (e) => {
  e.preventDefault();

  const name = document.getElementById("cName").value.trim();
  const email = document.getElementById("cEmail").value.trim();
  const subject = document.getElementById("cSubject").value;
  const message = document.getElementById("cMessage").value.trim();
  const msg = document.getElementById("contactMsg");

  if (!name || !email.includes("@") || !subject || message.length < 10) {
    msg.innerHTML = '<div class="alert alert-error">Please fill in all fields properly.</div>';
    return;
  }

  msg.innerHTML = `<div class="alert alert-success">Thanks, ${name} — your message has been sent.</div>`;
  document.getElementById("contactForm").reset();
};
