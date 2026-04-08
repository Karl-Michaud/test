# Changelog

## [Unreleased]

### Added
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
