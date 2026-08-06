let currentSession = null;

$(function () {
  $("#pDeadline").datepicker({ dateFormat: "yy-mm-dd", minDate: 0 });
});

const progressInput = document.getElementById("pProgress");
if (progressInput) {
  progressInput.oninput = () => {
    document.getElementById("pProgressOut").textContent = progressInput.value;
  };
}

async function loadTechnologies() {
  const list = [
    "HTML / CSS / JavaScript", "Python", "Java", "C / C++", "React",
    "Node.js", "MySQL", "MongoDB", "Arduino / Raspberry Pi", "Machine Learning", "Android", "Other"
  ];
  const sel = document.getElementById("pTechnology");
  if (sel) {
    sel.innerHTML = '<option value="">Select Technology</option>' + list.map(t => `<option value="${t}">${t}</option>`).join("");
  }
}

document.getElementById("addProjectForm").onsubmit = async (e) => {
  e.preventDefault();

  if (!currentSession) {
    document.getElementById("addProjectMsg").innerHTML = '<div class="alert alert-error">You must be logged in.</div>';
    return;
  }

  const name = document.getElementById("pName").value.trim();
  const description = document.getElementById("pDescription").value.trim();
  const technology = document.getElementById("pTechnology").value;
  const category = document.getElementById("pCategory").value.trim();
  const deadline = document.getElementById("pDeadline").value;
  const progress = parseInt(progressInput.value, 10);
  const notes = document.getElementById("pNotes").value.trim();

  if (!name || name.length < 4 || !description || !technology || !category || !deadline) {
    document.getElementById("addProjectMsg").innerHTML = '<div class="alert alert-error">Please fill in all required fields properly.</div>';
    return;
  }

  await addProject({
    name,
    student: currentSession.username,
    userId: currentSession.userId,
    category,
    technology,
    description,
    deadline,
    progress,
    grade: 0,
    notes,
    status: statusLabel(progress)
  });

  document.getElementById("addProjectMsg").innerHTML = `<div class="alert alert-success">Project "${name}" saved! <a href="projects.html">View ledger &rarr;</a></div>`;
  document.getElementById("addProjectForm").reset();
  if (document.getElementById("pProgressOut")) document.getElementById("pProgressOut").textContent = "0";
};

async function init() {
  currentSession = await requireLogin();
  updateNavForSession();
  loadTechnologies();
}

init();
