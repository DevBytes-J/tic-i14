# Testable Todo Item Card — Stage 1

A clean, accessible, and fully testable Todo Item Card built with vanilla HTML, CSS, and JavaScript.

## Live Demo

[https://tic-i14.vercel.app/](#)

## What Changed from Stage 0

- **Inline edit form** replaces the modal-based edit. The card itself transforms into an edit form in-place, then returns to view mode on save/cancel.
- **Status control** — a `<select>` dropdown on the card lets users switch between Pending, In Progress, and Done without opening a modal.
- **Priority indicator** — a colored left-border accent on the card changes with priority (green/yellow/red).
- **Expand / collapse** — long descriptions collapse to ~2 lines by default; a toggle button reveals the full text.
- **Overdue indicator** — a red "Overdue" badge appears next to the time remaining when the due date has passed.
- **Granular time display** — shows minutes, hours, or days remaining (e.g. "Due in 45 minutes", "Overdue by 2 hours"). Updates every 30 seconds.
- **Done state freezes time** — when status is Done, the time display shows "Completed" and stops updating.
- **Unified state object** — all card data lives in a single `state` object; `render()` and `applyStatus()` keep every element in sync.
- **Visual card states** — card border changes for Done (green tint), In Progress (blue tint), and Overdue (red tint).

## Features

- **Inline edit form** — title, description, priority, due date; save updates card, cancel restores previous values
- **Status dropdown** — Pending / In Progress / Done; synced with checkbox and status badge
- **Priority indicator** — colored left-border accent: Low (green), Medium (yellow), High (red)
- **Expand / collapse** — collapses descriptions over 120 chars; keyboard accessible with `aria-expanded`
- **Overdue indicator** — red badge + red time text when past due date
- **Live time remaining** — granular format, updates every 30 s; freezes to "Completed" when Done
- **Checkbox toggle** — marks Done / reverts to Pending; stays in sync with status control
- **Priority badges** — color-coded: Low (green), Medium (yellow), High (red)
- **Fully accessible** — keyboard navigable, focus trap in edit form and delete modal, `aria-live`, `aria-label`, `aria-expanded` throughout
- **Responsive** — works from 320px to 1200px; edit form fields stack vertically on mobile

## Stack

Vanilla HTML · CSS · JavaScript — no frameworks, no dependencies.

## Design Decisions

- Inline edit (not a modal) keeps the interaction lightweight and avoids a second overlay layer.
- A single `state` object is the source of truth; all DOM updates flow from `render()` / `applyStatus()` to prevent drift.
- `max-height` transition for expand/collapse avoids JavaScript height measurement.
- The priority indicator is a `position: absolute` left-border strip so it doesn't affect card layout.

## Known Limitations

- Due date input uses `type="date"` which has inconsistent native styling across browsers; the calendar icon is inverted via CSS filter as a best-effort fix.
- The expand/collapse threshold (120 chars) is a fixed character count, not a line-height measurement, so it may clip slightly differently across font sizes.
- Delete removes the card from the DOM permanently (no undo).

## Accessibility Notes

- Edit form fields all have `<label for="">` associations.
- Status `<select>` has an explicit `aria-label`.
- Expand toggle uses `aria-expanded` and `aria-controls` pointing to the collapsible section's `id`.
- Time remaining uses `aria-live="polite"` so screen readers announce updates without interrupting.
- Focus is trapped inside the edit form and delete modal; Escape closes both.
- Focus returns to the Edit button when the edit form is closed.

## data-testid Reference

### Stage 0 (unchanged)

| Element | `data-testid` |
|---|---|
| Card root | `test-todo-card` |
| Title | `test-todo-title` |
| Description | `test-todo-description` |
| Priority badge | `test-todo-priority` |
| Due date | `test-todo-due-date` |
| Time remaining | `test-todo-time-remaining` |
| Status badge | `test-todo-status` |
| Checkbox | `test-todo-complete-toggle` |
| Tags list | `test-todo-tags` |
| Work tag | `test-todo-tag-work` |
| Urgent tag | `test-todo-tag-urgent` |
| Edit button | `test-todo-edit-button` |
| Delete button | `test-todo-delete-button` |

### Stage 1 (new)

| Element | `data-testid` |
|---|---|
| Priority indicator bar | `test-todo-priority-indicator` |
| Status control (select) | `test-todo-status-control` |
| Overdue indicator badge | `test-todo-overdue-indicator` |
| Expand/collapse toggle | `test-todo-expand-toggle` |
| Collapsible section | `test-todo-collapsible-section` |
| Edit form container | `test-todo-edit-form` |
| Edit title input | `test-todo-edit-title-input` |
| Edit description textarea | `test-todo-edit-description-input` |
| Edit priority select | `test-todo-edit-priority-select` |
| Edit due date input | `test-todo-edit-due-date-input` |
| Save button | `test-todo-save-button` |
| Cancel button | `test-todo-cancel-button` |

## Running Locally

No build step — just open `index.html` in a browser.

```bash
git clone https://github.com/<DevBytes-J>/tic-i14.git
cd tic-i14
open index.html
```
