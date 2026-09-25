# TankTrack

TankTrack is a small dashboard for keeping freshwater aquarium care in one place. I built it because scattered test strips, notes, and maintenance reminders made it too easy to lose track of what each tank needed.

The app lets a keeper record each tank, log water readings, and keep a short maintenance list. It runs entirely in the browser, so it is quick to try and does not require an account or a database.

## What it can do

- Add tanks with their size and livestock details
- Record pH, GH, KH, nitrate, date, and notes for each water test
- Show the latest nitrate reading for each tank
- Create and complete maintenance tasks, including tasks shared across all tanks
- Import and export data as JSON backups

## Built with

- HTML and CSS for the interface
- Vanilla JavaScript for state, rendering, dialogs, and backup handling
- `localStorage` for browser-side persistence
- Node.js's built-in `http` and `fs` modules to serve the app locally

I kept the first version framework-free so the data flow and UI behavior stay easy to inspect. The repository also includes a starter PostgreSQL schema for the next version, where I plan to move beyond local browser storage.

## Run locally

You need a current version of Node.js. From the project directory, run:

```powershell
node server.js
```

Then visit [http://localhost:3000](http://localhost:3000). You can also open `index.html` directly for a quick preview.

## Project structure

```text
app.js              Client-side state and UI behavior
index.html          App layout and forms
styles.css          Responsive dashboard styling
server.js           Lightweight local development server
database/schema.sql Starter schema for the planned database-backed version
```

## Next steps

The next version will add trend charts, custom target ranges, recurring maintenance schedules, and server-side persistence. The broader implementation plan is in [docs/roadmap.md](docs/roadmap.md).
