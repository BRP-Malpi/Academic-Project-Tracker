async function init() {
  updateNavForSession();

  const projects = await getProjects();
  const users = await getUsers();

  document.getElementById("totalProjects").textContent = projects.length;
  document.getElementById("completedProjects").textContent = projects.filter(p => p.progress >= 100).length;
  document.getElementById("totalTeachers").textContent = users.filter(u => u.role === "teacher").length;

  const container = document.getElementById("recentProjects");
  if (projects.length === 0) {
    container.innerHTML = '<p class="small-muted">No projects logged yet. <a href="add-project.html">Add one.</a></p>';
    return;
  }

  const recent = projects.slice(-3).reverse();
  container.innerHTML = recent.map(p => `
    <div class="project-card">
      <div class="project-top">
        <span class="project-title">${p.name}</span>
        <span class="${statusBadgeClass(p.progress)}">${statusText(p.progress)}</span>
      </div>
      <div class="project-detail">Student: ${p.student} &middot; Category: ${p.category || "—"}</div>
      <progress value="${p.progress}" max="100"></progress>
    </div>
  `).join("");
}

init();
