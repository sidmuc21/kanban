# Kanban Board

A lightweight, elegant **Kanban Board** built with **SvelteKit** and **TailwindCSS**, featuring drag-and-drop, persistent storage, and a PWA-ready interface.

---

## Features

* 4 Lanes: **To Do**, **Doing**, **Done**, **Archive**.
* Create new issues with a **modal form**.
* Drag & drop issues between lanes (no external library).
* Persistent board state using **localStorage**.
* **Story points sum** displayed per lane.
* **Overdue warning** for issues past their due date.
* **Notifications** when an issue is marked as Done.
* Export all issues as **CSV**.
* Archive lane visually distinct.
* Responsive design with **TailwindCSS**.
* Display **user’s country** automatically via Geo API.
* PWA-ready: installable and offline-capable.

---

## Issue Fields

Each issue has the following properties:

* **Title** (required)
* **Description** (required)
* **Creation Date** (auto-generated)
* **Due Date**
* **Story Points**
* **Priority** (Low, Medium, High)
* **Unique ID** (auto-generated)

---

## Getting Started

### Prerequisites

* Node.js ≥ 18.x
* npm ≥ 9.x

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kanban.git
cd kanban
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev -- --open
```

The app should open automatically at `http://localhost:5173`.

---

## Build & Preview

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Usage

* Click **“+ Add Issue”** to create a new issue.
* Drag issues between lanes to update their status.
* Click **Export CSV** to download a CSV of all issues.
* Issues moved to **Done** trigger a browser notification (permission required).
* Archive lane has a different background to indicate archived issues.

---

## Tech Stack

* [SvelteKit](https://kit.svelte.dev/)
* [TailwindCSS](https://tailwindcss.com/)
* [date-fns](https://date-fns.org/) for date formatting
* LocalStorage for data persistence
* PWA-ready for offline usage

---

## Folder Structure

```
src/
 ├─ lib/
 │   ├─ components/    # Svelte components (IssueCard, AddIssueModal)
 │   ├─ stores/        # Board store and derived stores
 │   └─ utils/         # CSV export helper
 ├─ routes/
 │   └─ +page.svelte   # Main Kanban board
```

---

## PWA Installation

1. Click **“Add to Home Screen”** in supported browsers.
2. Works offline with cached data and assets.
3. Fully installable and behaves like a native app.

---

## Notes

* All user data is stored locally in **localStorage**.
* Browser notifications require user permission.
* The app fetches the user's country using `https://ipapi.co/json/`.
* Drag-and-drop works without any external library.

---
