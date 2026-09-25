const STORAGE_KEY = "tanktrack-data-v1";
const defaultData = {
  tanks: [
    { id: "tank-10", name: "10g Community", size: 10, unit: "g", residents: "Plants & community fish" },
    { id: "tank-20", name: "20g Planted", size: 20, unit: "g", residents: "Plants & peaceful fish" },
    { id: "tank-9", name: "9g Shrimp Garden", size: 9, unit: "g", residents: "Neocaridina & plants" },
    { id: "tank-5", name: "5g Nano", size: 5, unit: "g", residents: "Small planted setup" }
  ],
  tasks: [
    { id: "task-water", title: "Water change", tankId: "tank-10", done: false },
    { id: "task-ferts", title: "Dose liquid fertilizer", tankId: "all", done: false },
    { id: "task-carbon", title: "Dose liquid carbon", tankId: "tank-20", done: false },
    { id: "task-test", title: "Test shrimp tank water", tankId: "tank-9", done: false }
  ],
  logs: []
};

let data = loadData();
const $ = (selector) => document.querySelector(selector);
const today = new Date().toISOString().slice(0, 10);

function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(defaultData); }
  catch { return structuredClone(defaultData); }
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function tankName(id) { return id === "all" ? "All tanks" : data.tanks.find((tank) => tank.id === id)?.name || "Removed tank"; }
function latestLog(tankId) { return data.logs.filter((log) => log.tankId === tankId).sort((a,b) => b.date.localeCompare(a.date))[0]; }
function formatDate(date) { return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00:00`)); }
function empty(container) { container.replaceChildren($("#empty-state").content.cloneNode(true)); }

function render() {
  $("#today-label").textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase();
  $("#tank-count").textContent = data.tanks.length;
  renderTanks(); renderTasks(); renderLogs(); renderSummary(); populateTankSelects(); saveData();
}
function renderSummary() {
  const remaining = data.tasks.filter((task) => !task.done).length;
  $("#task-count").textContent = remaining;
  $("#task-detail").textContent = remaining ? "to complete" : "all caught up";
  const latest = [...data.logs].sort((a,b) => b.date.localeCompare(a.date)).find((log) => log.nitrate !== "");
  $("#nitrate-value").textContent = latest ? `${latest.nitrate} ppm` : "—";
  $("#nitrate-detail").textContent = latest ? `${tankName(latest.tankId)} · ${formatDate(latest.date)}` : "log a test";
}
function renderTanks() {
  const list = $("#tank-list"); list.replaceChildren();
  if (!data.tanks.length) return empty(list);
  data.tanks.forEach((tank) => {
    const log = latestLog(tank.id); const row = document.createElement("article"); row.className = "tank-row";
    row.innerHTML = `<div class="tank-bubble">${tank.size}${tank.unit}</div><div><strong>${escapeHtml(tank.name)}</strong><small>${escapeHtml(tank.residents || "No residents listed")}</small></div><div class="tank-reading">${log?.nitrate !== "" && log ? `${log.nitrate} ppm NO₃` : "No readings"}<span>${log ? formatDate(log.date) : "Log a test"}</span></div>`;
    list.append(row);
  });
}
function renderTasks() {
  const list = $("#task-list"); list.replaceChildren();
  const completed = data.tasks.filter((task) => task.done).length;
  $("#progress-label").textContent = `${completed} of ${data.tasks.length} completed`;
  $("#progress-bar").style.width = data.tasks.length ? `${(completed / data.tasks.length) * 100}%` : "0%";
  if (!data.tasks.length) return empty(list);
  data.tasks.forEach((task) => {
    const row = document.createElement("article"); row.className = `task-row ${task.done ? "done" : ""}`;
    row.innerHTML = `<input class="task-check" type="checkbox" ${task.done ? "checked" : ""} aria-label="Complete ${escapeHtml(task.title)}"><label>${escapeHtml(task.title)}</label><div><span class="task-tank">${escapeHtml(tankName(task.tankId))}</span><button class="delete-button" aria-label="Delete ${escapeHtml(task.title)}">×</button></div>`;
    row.querySelector("input").addEventListener("change", () => { task.done = !task.done; render(); });
    row.querySelector("button").addEventListener("click", () => { data.tasks = data.tasks.filter((item) => item.id !== task.id); render(); });
    list.append(row);
  });
}
function renderLogs() {
  const list = $("#log-list"); list.replaceChildren();
  const logs = [...data.logs].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 10);
  if (!logs.length) { const row = document.createElement("tr"); row.innerHTML = '<td colspan="7"><div class="empty-state">No water tests yet. Your first reading will appear here.</div></td>'; list.append(row); return; }
  logs.forEach((log) => { const row = document.createElement("tr"); row.innerHTML = `<td>${formatDate(log.date)}</td><td>${escapeHtml(tankName(log.tankId))}</td><td>${value(log.ph)}</td><td>${value(log.gh)}</td><td>${value(log.kh)}</td><td>${value(log.nitrate)}</td><td title="${escapeHtml(log.notes)}">${escapeHtml(log.notes || "—")}</td>`; list.append(row); });
}
function value(item) { return item === "" || item === undefined ? "—" : item; }
function escapeHtml(text) { const div = document.createElement("div"); div.textContent = text; return div.innerHTML; }
function populateTankSelects() {
  const selects = [$("#log-tank"), $("#task-tank")];
  selects.forEach((select, index) => { const selected = select.value; select.innerHTML = index ? '<option value="all">All tanks</option>' : ""; data.tanks.forEach((tank) => select.add(new Option(tank.name, tank.id))); if ([...select.options].some((option) => option.value === selected)) select.value = selected; });
}

document.querySelectorAll("[data-open-modal]").forEach((button) => button.addEventListener("click", () => {
  const modal = $(`#${button.dataset.openModal}-modal`); if (button.dataset.openModal === "log") $("#log-form [name=date]").value = today; modal.showModal();
}));
$("#settings-button").addEventListener("click", () => $("#settings-modal").showModal());
$("#tank-form").addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); data.tanks.push({ id: crypto.randomUUID(), name: form.get("name").trim(), size: form.get("size"), unit: form.get("unit"), residents: form.get("residents").trim() }); event.currentTarget.closest("dialog").close(); event.currentTarget.reset(); render(); });
$("#task-form").addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); data.tasks.push({ id: crypto.randomUUID(), title: form.get("title").trim(), tankId: form.get("tankId"), done: false }); event.currentTarget.closest("dialog").close(); event.currentTarget.reset(); render(); });
$("#log-form").addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); data.logs.push({ id: crypto.randomUUID(), tankId: form.get("tankId"), date: form.get("date"), ph: form.get("ph"), gh: form.get("gh"), kh: form.get("kh"), nitrate: form.get("nitrate"), notes: form.get("notes").trim() }); event.currentTarget.closest("dialog").close(); event.currentTarget.reset(); render(); });
$("#export-button").addEventListener("click", () => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `tanktrack-backup-${today}.json` }); link.click(); URL.revokeObjectURL(link.href); });
$("#import-input").addEventListener("change", async (event) => { const file = event.target.files[0]; if (!file) return; try { const imported = JSON.parse(await file.text()); if (!Array.isArray(imported.tanks) || !Array.isArray(imported.tasks) || !Array.isArray(imported.logs)) throw new Error(); data = imported; $("#settings-modal").close(); render(); } catch { alert("That file is not a valid TankTrack backup."); } event.target.value = ""; });
$("#reset-button").addEventListener("click", () => { if (confirm("Reset all tanks, tasks, and readings? This cannot be undone unless you exported a backup.")) { data = structuredClone(defaultData); $("#settings-modal").close(); render(); } });
render();
