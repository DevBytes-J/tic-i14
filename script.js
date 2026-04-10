const DUE = new Date("2026-04-17T18:00:00Z");

const timeEl      = document.getElementById("todo-time-remaining");
const statusEl    = document.getElementById("todo-status");
const titleEl     = document.getElementById("todo-title");
const descEl      = document.querySelector("[data-testid='test-todo-description']");
const priorityEl  = document.querySelector("[data-testid='test-todo-priority']");
const toggle      = document.getElementById("todo-complete");
const timeMeta    = timeEl.closest(".meta-item");

// Time
function timeRemaining() {
  const diff = DUE - Date.now();
  const abs  = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const hrs  = Math.floor(abs / 3600000);
  const days = Math.floor(abs / 86400000);
  if (diff <= 0) {
    if (mins < 1)  return { text: "Due now!",            ok: false };
    if (hrs  < 1)  return { text: `Overdue by ${mins}m`, ok: false };
    if (days < 1)  return { text: `Overdue by ${hrs}h`,  ok: false };
    return               { text: `Overdue by ${days}d`,  ok: false };
  }
  if (mins  < 60)  return { text: `Due in ${mins}m`,     ok: true };
  if (hrs   < 24)  return { text: `Due in ${hrs}h`,      ok: true };
  if (days  === 1) return { text: "Due tomorrow",        ok: true };
  return               { text: `Due in ${days} days`,    ok: true };
}

function updateTime() {
  const { text, ok } = timeRemaining();
  timeEl.textContent = text;
  timeMeta.classList.toggle("ok", ok);
}

updateTime();
setInterval(updateTime, 60000);

// Checkbox 
toggle.addEventListener("change", () => {
  const done = toggle.checked;
  titleEl.classList.toggle("done", done);
  if (done) {
    statusEl.textContent = "Done";
    statusEl.setAttribute("aria-label", "Status: Done");
    statusEl.classList.add("done");
  } else {
    statusEl.textContent = "In Progress";
    statusEl.setAttribute("aria-label", "Status: In Progress");
    statusEl.classList.remove("done");
  }
});

// Modal helpers
const PRIORITY_CLASSES = { Low: "badge--low", Medium: "badge--medium", High: "badge--high" };

function openModal(el) {
  el.hidden = false;
  el.querySelector(".modal__close, .modal-cancel, #confirm-delete, [type='submit']")?.focus();
}

function closeModal(el) {
  el.hidden = true;
}

function trapFocus(modal, e) {
  const focusable = [...modal.querySelectorAll(
    'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  )].filter(el => !el.disabled);
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.key === "Tab") {
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  if (e.key === "Escape") closeModal(modal);
}

// Edit modal 
const editModal    = document.getElementById("edit-modal");
const editForm     = document.getElementById("edit-form");
const editTitle    = document.getElementById("edit-title");
const editDesc     = document.getElementById("edit-desc");
const editPriority = document.getElementById("edit-priority");
const editStatus   = document.getElementById("edit-status");

document.querySelector("[data-testid='test-todo-edit-button']").addEventListener("click", () => {
  editTitle.value    = titleEl.textContent.trim();
  editDesc.value     = descEl.textContent.trim();
  editPriority.value = priorityEl.textContent.trim();
  editStatus.value   = statusEl.textContent.trim();
  openModal(editModal);
  editTitle.focus();
});

editForm.addEventListener("submit", e => {
  e.preventDefault();
  const newPriority = editPriority.value;
  const newStatus   = editStatus.value;

  titleEl.textContent = editTitle.value.trim() || titleEl.textContent;
  descEl.textContent  = editDesc.value.trim()  || descEl.textContent;

  // Update priority badge
  priorityEl.textContent = newPriority;
  priorityEl.className   = `badge ${PRIORITY_CLASSES[newPriority] || "badge--high"}`;
  priorityEl.setAttribute("aria-label", `Priority: ${newPriority}`);
  // Re-add dot
  const dot = document.createElement("span");
  dot.className = "badge__dot";
  dot.setAttribute("aria-hidden", "true");
  priorityEl.prepend(dot);

  // Update status badge
  const done = newStatus === "Done";
  statusEl.textContent = newStatus;
  statusEl.setAttribute("aria-label", `Status: ${newStatus}`);
  statusEl.classList.toggle("done", done);
  titleEl.classList.toggle("done", done);
  toggle.checked = done;

  closeModal(editModal);
});

//Delete modal 
const deleteModal   = document.getElementById("delete-modal");
const deleteTaskName = document.getElementById("delete-task-name");

document.querySelector("[data-testid='test-todo-delete-button']").addEventListener("click", () => {
  deleteTaskName.textContent = `"${titleEl.textContent.trim()}"`;
  openModal(deleteModal);
  document.getElementById("confirm-delete").focus();
});

document.getElementById("confirm-delete").addEventListener("click", () => {
  document.querySelector("[data-testid='test-todo-card']").remove();
  closeModal(deleteModal);
});

// Shared close / trap 
[editModal, deleteModal].forEach(modal => {
  modal.querySelector(".modal__close").addEventListener("click", () => closeModal(modal));
  modal.querySelector(".modal-cancel").addEventListener("click", () => closeModal(modal));
  modal.querySelector(".modal__backdrop").addEventListener("click", () => closeModal(modal));
  modal.addEventListener("keydown", e => trapFocus(modal, e));
});
