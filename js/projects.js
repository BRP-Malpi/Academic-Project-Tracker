let currentProjects = [];
let currentSort = { col: "name", asc: true };
let currentSession = null;

function renderTable() {
  const tbody = document.getElementById("projectTableBody");
  if (currentProjects.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="small-muted" style="text-align:center; padding:20px;">No projects logged yet. <a href="add-project.html">Add one.</a></td></tr>';
    return;
  }

  tbody.innerHTML = currentProjects.map(p => {
    const days = daysUntil(p.deadline);
    const daysLabel = days === null ? "—" : (days < 0 ? "Overdue" : days + "d");
    const canDelete = currentSession && (currentSession.role === "teacher" || p.userId === currentSession.userId);
    const deleteBtn = canDelete ? `<button class="btn btn-outline btn-sm" onclick="deleteRow(${p.id})">Delete</button>` : "";

    return `<tr>
      <td>${p.name}</td>
      <td>${p.student}</td>
      <td>${p.category || "—"}</td>
      <td><progress value="${p.progress}" max="100" style="width:80px;"></progress> <span class="${statusBadgeClass(p.progress)}">${p.progress}%</span></td>
      <td>${p.grade > 0 ? p.grade : "—"}</td>
      <td>${p.deadline || "—"}${days !== null ? ` <small>(${daysLabel})</small>` : ""}</td>
      <td>${deleteBtn}</td>
    </tr>`;
  }).join("");
}

async function deleteRow(id) {
  if (!confirm("Delete this project?")) return;
  await deleteProject(id);
  currentProjects = currentProjects.filter(p => p.id != id);
  renderTable();
  populateSelects();
}

function sortProjects() {
  const { col, asc } = currentSort;
  currentProjects.sort((a, b) => {
    const va = a[col] || "";
    const vb = b[col] || "";
    if (typeof va === "number" && typeof vb === "number") return asc ? va - vb : vb - va;
    return asc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });
}

function populateSelects() {
  const opts = currentProjects.map(p => `<option value="${p.id}">${p.name}</option>`).join("") || "<option>No projects</option>";
  document.getElementById("gradeSelect").innerHTML = opts;
  document.getElementById("progressSelect").innerHTML = opts;

  if (currentProjects.length > 0) {
    const first = currentProjects[0];
    $("#newProgressSlider").slider("value", first.progress);
    $("#newProgress").val(first.progress);
    $("#progressValDisplay").text(first.progress);
    document.getElementById("newGrade").value = first.grade > 0 ? first.grade : "";
  }
}

async function updateGrade() {
  const id = document.getElementById("gradeSelect").value;
  const val = parseInt(document.getElementById("newGrade").value, 10);
  if (!id || id === "No projects" || isNaN(val) || val < 0 || val > 100) return;

  await updateProject(id, { grade: val });
  document.getElementById("gradeMsg").innerHTML = '<div class="alert alert-success">Grade updated.</div>';
  currentProjects = await getProjects();
  sortProjects();
  renderTable();
}

async function updateProgress() {
  const id = document.getElementById("progressSelect").value;
  const val = parseInt(document.getElementById("newProgress").value, 10);
  if (!id || id === "No projects") return;

  await updateProject(id, { progress: val, status: statusLabel(val) });
  document.getElementById("progressMsg").innerHTML = '<div class="alert alert-success">Progress updated.</div>';
  currentProjects = await getProjects();
  sortProjects();
  renderTable();
}

async function init() {
  currentSession = await updateNavForSession();
  currentProjects = await getProjects();
  sortProjects();
  renderTable();
  populateSelects();

  $("#newProgressSlider").slider({
    min: 0, max: 100, value: 50,
    slide: (e, ui) => {
      $("#newProgress").val(ui.value);
      $("#progressValDisplay").text(ui.value);
    }
  });

  $(".sortable").on("click", function () {
    const col = $(this).data("sort");
    currentSort.asc = currentSort.col === col ? !currentSort.asc : true;
    currentSort.col = col;
    sortProjects();
    renderTable();
  });

  $("#progressSelect").on("change", function () {
    const p = currentProjects.find(item => item.id == $(this).val());
    if (p) {
      $("#newProgressSlider").slider("value", p.progress);
      $("#newProgress").val(p.progress);
      $("#progressValDisplay").text(p.progress);
    }
  });

  $("#gradeSelect").on("change", function () {
    const p = currentProjects.find(item => item.id == $(this).val());
    if (p) document.getElementById("newGrade").value = p.grade > 0 ? p.grade : "";
  });
}

init();
