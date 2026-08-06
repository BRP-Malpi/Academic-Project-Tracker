const DEFAULT_USERS = [
  { id: 1, username: "profkarki", email: "karki@example.edu", phone: "9812345678", dob: "1980-05-12", department: "Computer Science & IT", role: "teacher", password: "password123" },
  { id: 2, username: "dr_maskey", email: "maskey@example.edu", phone: "9812345679", dob: "1975-10-20", department: "Computer Science & IT", role: "teacher", password: "password123" },
  { id: 3, username: "aarav_sharma", email: "aarav@example.edu", phone: "9812345670", dob: "2005-01-01", department: "Computer Science & IT", role: "student", password: "password123" },
  { id: 4, username: "priya_gurung", email: "priya@example.edu", phone: "9812345671", dob: "2005-02-02", department: "Computer Science & IT", role: "student", password: "password123" }
];

const DEFAULT_PROJECTS = [
  { id: 1, name: "Smart Attendance System", student: "aarav_sharma", userId: 3, category: "Computer Science", technology: "Python", description: "Facial recognition attendance system.", deadline: "2026-08-15", progress: 75, grade: 88, notes: "Testing in progress", status: "in-progress" },
  { id: 2, name: "IoT Weather Station", student: "priya_gurung", userId: 4, category: "Electronics", technology: "Arduino / Raspberry Pi", description: "Real-time environment monitoring system.", deadline: "2026-09-01", progress: 40, grade: 0, notes: "Sensors installed", status: "started" }
];

function loadData(key, fallback) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  return JSON.parse(data);
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* --- Users --- */
async function getUsers() {
  return loadData("apt_users", DEFAULT_USERS);
}

async function getUserByUsername(username) {
  const users = await getUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

async function addUser(user) {
  const users = await getUsers();
  user.id = Date.now();
  users.push(user);
  saveData("apt_users", users);
  return user.id;
}

/* --- Projects --- */
async function getProjects() {
  return loadData("apt_projects", DEFAULT_PROJECTS);
}

async function addProject(project) {
  const projects = await getProjects();
  project.id = Date.now();
  projects.push(project);
  saveData("apt_projects", projects);
  return project.id;
}

async function updateProject(id, changes) {
  const projects = await getProjects();
  const index = projects.findIndex(p => p.id == id);
  if (index !== -1) {
    Object.assign(projects[index], changes);
    saveData("apt_projects", projects);
  }
}

async function deleteProject(id) {
  const projects = await getProjects();
  const filtered = projects.filter(p => p.id != id);
  saveData("apt_projects", filtered);
}

/* --- Session --- */
async function getSession() {
  const session = localStorage.getItem("apt_session");
  return session ? JSON.parse(session) : null;
}

async function setSession(user) {
  const sessionData = { id: user.id || user.userId, userId: user.id || user.userId, username: user.username, role: user.role };
  saveData("apt_session", sessionData);
}

async function clearSession() {
  localStorage.removeItem("apt_session");
}

/* --- Helpers --- */
function statusLabel(progress) {
  if (progress >= 100) return "completed";
  if (progress >= 50) return "in-progress";
  return "started";
}

function statusText(progress) {
  const s = statusLabel(progress);
  if (s === "completed") return "Completed";
  if (s === "in-progress") return "In Progress";
  return "Started";
}

function statusBadgeClass(progress) {
  const s = statusLabel(progress);
  if (s === "completed") return "badge badge-completed";
  if (s === "in-progress") return "badge badge-progress";
  return "badge badge-started";
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.round((target - today) / 86400000);
}
