# Bug Tracker (Take-Home; Boost Collective)

Internal tool for engineering teams to report, triage, and resolve bugs. Built as a take-home MVP.

## MVP scope

This is an MVP as requested at the end of the interview yesterday. A few things were intentionally kept simple or left out:

1. **No login flow.** Engineers identify themselves via the dropdown in the top right rather than a full auth system.
2. **Rudimentary Supabase database.** Schema is minimal, just enough to support the core workflows.
3. **Engineer side only (User A).** We didn't implement the lower-friction, less technical website for non-engineers to report bugs (User B user stories).

## What it does (User A user stories)

**Backlog** is the main view. Shows all open bugs. Anyone can report a new bug, change its severity, or dismiss it. If you've selected your name, you can also claim a bug to take ownership.

**My Bugs** shows only bugs assigned to you. You can mark them resolved once the work is done.

**History** is a log of every resolved bug, who fixed it, and when.

**Bug detail** lets you click any row to open the full view. Read the description, leave notes, change severity, claim/unclaim, resolve, or dismiss.

## How engineers identify themselves

Top-right corner of the navbar has a dropdown. Pick your name from the list or create a new one. Selection persists between sessions.

## Severity levels

| Level | Meaning |
|---|---|
| Critical | Blocking, needs immediate attention |
| High | Serious issue, high priority |
| Medium | Should be fixed soon |
| Low | Nice to fix, not urgent |

## Tech

Next.js · Supabase (Postgres) · Tailwind CSS · TypeScript
