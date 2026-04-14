// ── State ──────────────────────────────────────────────────────────────────
const state = {
  title:       "Survive the 10am Standup Nobody Asked For",
  description: "Reply to 7 unread emails before the 10am standup, prepare a brief update on the current sprint progress, review the pull requests that have been sitting in the queue since last Thursday, and make sure the staging environment is actually working before anyone asks about it.",
  priority:    "High",
  status:      "In Progress",
  due:         new Date("2026-04-17T18:00:00Z"),
};

const COLLAPSE_THRESHOLD = 120; // chars before collapsing

// ── DOM refs ────────────────────────────────────────────────────────────────
const card            = document.querySelector("[data-testid='test-todo-card']");
const titleEl         = document.querySelector("[data-testid='test-todo-title']");
const descEl          = document.querySelector("[data-testid='test-todo-description']");
const priorityBadge   = document.querySelector("[data-testid='test-todo-priority']");
const statusBadge     = document.querySelector("[data-testid='test-todo-status']");
const priorityBar     = document.querySelector("[data-testid='test-todo-priority-indicator']");
const toggle          = document.querySelector("[data-testid='test-todo-complete-toggle']");
const statusControl   = document.querySelector("[data-testid='test-todo-status-control']");
const timeEl          = document.querySelector("[data-testid='test-todo-time-remaining']");
const overdueEl       = document.querySelector("[data-testid='test-todo-overdue-indicator']");
const timeMeta        = document.getElementById("time-meta");
const dueDateEl       = document.querySelector("[data-testid='test-todo-due-date']");
const collapsible     = document.querySelector("[data-testid='test-todo-collapsible-section']");
const expandToggle    = document.querySelector("[data-testid='test-todo-expand-toggle']");
const expandLabel     = expandToggle.querySelector(".expand-toggle__label");
const cardView        = document.getElementById("card-view");
const cardEdit        = document.getElementById("card-edit");
const editForm        = document.querySelector("[data-testid='test-todo-edit-form']");
const editTitleInput  = document.querySelector("[data-testid='test-todo-edit-title-input']");
const editDescInput   = document.querySelector("[data-testid='test-todo-edit-description-input']");
const editPriority    = document.querySelector("[data-testid='test-todo-edit-priority-select']");
const editDueDate     = document.querySelector("[data-testid='test-todo-edit-due-date-input']");
const editBtn         = document.querySelector("[data-testid='test-todo-edit-button']");
const cancelBtn       = document.querySelector("[data-testid='test-todo-cancel-button']");
const deleteBtn       = document.querySelector("[data-testid='test-todo-delete-button']");
const deleteModal     = document.getElementById("delete-modal");
const deleteTaskName  = document.getElementById("delete-task-name");

// ── Priority helpers ─────────────────────────────────────────────────────────
const PRIORITY_BADGE = { Low: "badge--low", Medium: "badge--medium", High: "badge--high" };
const PRIORITY_BAR   = { Low: "priority-indicator--low", Medium: "priority-indicator--medium", High: "priority-indicator--high" };

function applyPriority(p) {
  priorityBadge.className = `badge ${PRIORITY_BADGE[p]}`;
  priorityBadge.setAttribute("aria-label", `Priority: ${p}`);
  priorityBadge.innerHTML = `<span class="badge__dot" aria-hidden="true"></span>${p}`;
  priorityBar.className   = `priority-indicator ${PRIORITY_BAR[p]}`;
}

// ── Status helpers ───────────────────────────────────────────────────────────
function applyStatus(s) {
  const done    = s === "Done";
  const pending = s === "Pending";

  statusBadge.textContent = s;
  statusBadge.setAttribute("aria-label", `Status: ${s}`);
  statusBadge.className = "badge badge--status" + (done ? " done" : pending ? " pending" : "");

  titleEl.classList.toggle("done", done);
  toggle.checked = done;
  statusControl.value = s;

  card.classList.toggle("state-done",        done);
  card.classList.toggle("state-in-progress", s === "In Progress");

  if (done) {
    timeEl.textContent = "Completed";
    overdueEl.hidden   = true;
    timeMeta.classList.remove("ok");
    timeMeta.classList.add("done-time");
    clearInterval(timerID);
  } else {
    timeMeta.classList.remove("done-time");
    updateTime();
    startTimer();
  }
}

// ── Time ─────────────────────────────────────────────────────────────────────
let timerID;

function formatTime() {
  const diff = state.due - Date.now();
  const abs  = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const hrs  = Math.floor(abs / 3600000);
  const days = Math.floor(abs / 86400000);

  if (diff <= 0) {
    if (mins < 1)  return { text: "Due now!",                  overdue: true };
    if (hrs  < 1)  return { text: `Overdue by ${mins} minute${mins !== 1 ? "s" : ""}`, overdue: true };
    if (days < 1)  return { text: `Overdue by ${hrs} hour${hrs !== 1 ? "s" : ""}`,     overdue: true };
    return               { text: `Overdue by ${days} day${days !== 1 ? "s" : ""}`,     overdue: true };
  }
  if (mins  < 60)  return { text: `Due in ${mins} minute${mins !== 1 ? "s" : ""}`,     overdue: false };
  if (hrs   < 24)  return { text: `Due in ${hrs} hour${hrs !== 1 ? "s" : ""}`,         overdue: false };
  if (days  === 1) return { text: "Due tomorrow",                                       overdue: false };
  return               { text: `Due in ${days} days`,                                  overdue: false };
}

function updateTime() {
  if (state.status === "Done") return;
  const { text, overdue } = formatTime();
  timeEl.textContent = text;
  overdueEl.hidden   = !overdue;
  timeMeta.classList.toggle("ok",    !overdue);
  card.classList.toggle("state-overdue", overdue);
}

function startTimer() {
  clearInterval(timerID);
  timerID = setInterval(updateTime, 30000);
}

// ── Expand / Collapse ────────────────────────────────────────────────────────
function initExpandCollapse() {
  const needsCollapse = state.description.length > COLLAPSE_THRESHOLD;
  expandToggle.hidden = !needsCollapse;
  if (!needsCollapse) {
    collapsible.classList.remove("collapsed");
    collapsible.classList.add("expanded");
  }
}

expandToggle.addEventListener("click", () => {
  const expanded = expandToggle.getAttribute("aria-expanded") === "true";
  expandToggle.setAttribute("aria-expanded", String(!expanded));
  collapsible.classList.toggle("collapsed", expanded);
  collapsible.classList.toggle("expanded",  !expanded);
  expandLabel.textContent = expanded ? "Show more" : "Show less";
});

// ── Render from state ────────────────────────────────────────────────────────
function render() {
  titleEl.textContent = state.title;
  descEl.textContent  = state.description;

  const d = state.due;
  const dateStr = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  dueDateEl.textContent = dateStr;
  dueDateEl.setAttribute("datetime", d.toISOString());
  dueDateEl.setAttribute("aria-label", `Due ${d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`);

  applyPriority(state.priority);
  applyStatus(state.status);
  initExpandCollapse();
}

// ── Checkbox ─────────────────────────────────────────────────────────────────
toggle.addEventListener("change", () => {
  state.status = toggle.checked ? "Done" : "Pending";
  applyStatus(state.status);
});

// ── Status control ───────────────────────────────────────────────────────────
statusControl.addEventListener("change", () => {
  state.status = statusControl.value;
  applyStatus(state.status);
});

// ── Edit mode ────────────────────────────────────────────────────────────────
function toDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

function openEdit() {
  editTitleInput.value  = state.title;
  editDescInput.value   = state.description;
  editPriority.value    = state.priority;
  editDueDate.value     = toDateInputValue(state.due);
  cardView.hidden       = true;
  cardEdit.hidden       = false;
  editTitleInput.focus();
}

function closeEdit() {
  cardEdit.hidden = false; // keep in DOM for testid access
  cardView.hidden = false;
  cardEdit.hidden = true;
  editBtn.focus();
}

editBtn.addEventListener("click", openEdit);
cancelBtn.addEventListener("click", closeEdit);

editForm.addEventListener("submit", e => {
  e.preventDefault();
  const newTitle = editTitleInput.value.trim();
  const newDesc  = editDescInput.value.trim();
  const newDue   = new Date(editDueDate.value + "T18:00:00Z");

  if (newTitle) state.title       = newTitle;
  if (newDesc)  state.description = newDesc;
  state.priority = editPriority.value;
  if (!isNaN(newDue)) state.due  = newDue;

  render();
  closeEdit();
});

// Trap focus inside edit form
cardEdit.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeEdit(); return; }
  if (e.key !== "Tab") return;
  const focusable = [...cardEdit.querySelectorAll("button, input, textarea, select")].filter(el => !el.disabled);
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

// ── Delete modal ─────────────────────────────────────────────────────────────
function openModal(el)  { el.hidden = false; }
function closeModal(el) { el.hidden = true; }

function trapFocus(modal, e) {
  const focusable = [...modal.querySelectorAll("button, input, [tabindex]:not([tabindex='-1'])")].filter(el => !el.disabled);
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.key === "Tab") {
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  if (e.key === "Escape") closeModal(modal);
}

deleteBtn.addEventListener("click", () => {
  deleteTaskName.textContent = `"${state.title}"`;
  openModal(deleteModal);
  document.getElementById("confirm-delete").focus();
});

document.getElementById("confirm-delete").addEventListener("click", () => {
  card.remove();
  closeModal(deleteModal);
});

deleteModal.querySelector(".modal__close").addEventListener("click",   () => closeModal(deleteModal));
deleteModal.querySelector(".modal-cancel").addEventListener("click",   () => closeModal(deleteModal));
deleteModal.querySelector(".modal__backdrop").addEventListener("click", () => closeModal(deleteModal));
deleteModal.addEventListener("keydown", e => trapFocus(deleteModal, e));

// ── Init ──────────────────────────────────────────────────────────────────────
render();
startTimer();
