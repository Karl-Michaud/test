# Changelog

## [Unreleased]

### Added
- Part 5: History page
  - `features/history/viewmodels/useHistoryViewModel.ts` — fetches resolved/dismissed bugs ordered by `resolved_at DESC`
  - `features/history/views/components/HistoryTable.tsx` — sortable table with severity/status badges, assignee, reporter, notes (truncated with full text on hover), resolved date
  - `features/history/views/HistoryView.tsx` — view with loading/error states
  - `app/history/page.tsx` — route at `/history`
- Part 4: Triage
  - `shared/components/SeveritySelect.tsx` — inline severity dropdown styled after reference StageSelect
  - `useBacklogViewModel` extended with `updateSeverity` (sets severity + marks bug as `triaged`) and `dismissBug` (sets `dismissed`, records `resolved_at`)
  - `BacklogTable` severity column replaced with `SeveritySelect` when `onUpdateSeverity` prop is provided
  - `BacklogView` wires up severity changes and Dismiss button in the actions column
- Part 3: Ownership & My Bugs
  - `useBacklogViewModel` extended with `claimBug` and `unclaimBug` (optimistic updates)
  - `BacklogView` now renders Claim/Unclaim buttons per row based on current engineer
  - `features/my-bugs/viewmodels/useMyBugsViewModel.ts` — fetches bugs assigned to current engineer, `markResolved` action
  - `features/my-bugs/views/components/MyBugsTable.tsx` — table with Mark Resolved action per row
  - `features/my-bugs/views/MyBugsView.tsx` — view with no-engineer guard state
  - `app/my-bugs/page.tsx` — route at `/my-bugs`
- Part 2: Backlog page
  - `features/backlog/models/types.ts` — `Bug`, `BugSeverity`, `BugStatus` types
  - `features/backlog/viewmodels/useBacklogViewModel.ts` — fetches active bugs from Supabase
  - `features/backlog/views/components/BacklogTable.tsx` — sortable table with severity/status badges, assignee, reporter, date columns; optional `actionSlot` for future actions
  - `features/backlog/views/BacklogView.tsx` — page view with loading/error states
  - `app/backlog/page.tsx` — route at `/backlog`

### Added
- Part 1: Project setup and infrastructure
  - Installed `@supabase/supabase-js` and `@tanstack/react-table`
  - Supabase migration files for `bug_severity`/`bug_status` enums, `engineers` table, `bugs` table (with `updated_at` trigger), and dev seed data
  - `shared/supabase/client.ts` — Supabase client helper
  - `shared/components/DataTable.tsx` — generic sortable/selectable table (TanStack React Table v8)
  - `shared/components/Navbar.tsx` — sticky navigation (Backlog, My Bugs, History)
  - `shared/components/EngineerSelector.tsx` — dropdown to set current engineer identity
  - `shared/context/EngineerContext.tsx` — engineer identity context persisted to localStorage
  - Updated `app/layout.tsx` with `EngineerProvider` and `Navbar`
