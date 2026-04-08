# Bug Tracker

An internal tool for engineering teams to report, triage, and resolve bugs. Built as a takehome MVP.

## What it does

**Backlog** — the main view. Shows all open bugs. Anyone can report a new bug, change its severity, or dismiss it. If you've selected your name, you can also claim a bug to take ownership of it.

**My Bugs** — shows only the bugs assigned to you. From here you can mark them as resolved once the work is done.

**History** — a log of every bug that's been resolved, who fixed it, and when.

**Bug detail** — click any row to open the full bug view. You can read the description, leave notes, change the severity, claim/unclaim it, resolve it, or dismiss it.

## How engineers identify themselves

Top-right corner of the navbar has a dropdown. Pick your name from the list, or create a new one. Your selection is remembered between sessions.

## Severity levels

| Level | Meaning |
|---|---|
| Critical | Blocking — needs immediate attention |
| High | Serious issue, high priority |
| Medium | Should be fixed soon |
| Low | Nice to fix, not urgent |

## Tech

Next.js · Supabase (Postgres) · Tailwind CSS · TypeScript
