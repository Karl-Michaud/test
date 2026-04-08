-- Fix: bugs table RLS policies were scoped to `authenticated` but the app
-- uses the anon key, so updates were silently dropped (0 rows, no error).
-- This is an internal tool so allow anon full access.

DROP POLICY IF EXISTS backlog_read_policy ON bugs;
DROP POLICY IF EXISTS backlog_update_policy ON bugs;

ALTER TABLE bugs DISABLE ROW LEVEL SECURITY;
