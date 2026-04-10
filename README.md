# Testable Todo Item Card

A clean, accessible, and fully testable Todo Item Card built with vanilla HTML, CSS, and JavaScript.

## Live Demo

[View live](#) 

## Features

- **Edit modal** — update title, description, priority, and status inline
- **Delete modal** — confirmation dialog before removing the card
- **Live time remaining** — calculates from a fixed due date, refreshes every 60 seconds
- **Checkbox toggle** — strikes through title and flips status to Done
- **Priority badges** — color-coded: Low (green), Medium (yellow), High (red)
- **Fully accessible** — keyboard navigable, focus trap in modals, `aria-live`, `aria-label` throughout
- **Responsive** — works from 320px to 1200px with no horizontal overflow

## Stack

Vanilla HTML · CSS · JavaScript — no frameworks, no dependencies.

## data-testid Reference

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

## Running Locally

No build step — just open `index.html` in a browser.

```bash
git clone https://github.com/<DevBytes-J>/tic-i14.git
cd tic-i14
open index.html
```
