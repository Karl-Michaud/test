# Changelog

## [Unreleased]

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
