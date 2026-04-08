-- Dev seed: backlog bugs
INSERT INTO bugs (title, description, severity, status, reporter_name) VALUES
  ('Login page crashes on Safari 17', 'Users on Safari 17 get a white screen after submitting credentials. Console shows uncaught TypeError.', 'critical', 'open', 'QA Team'),
  ('Dashboard takes 12s to load', 'The main dashboard makes 40+ sequential API calls on mount. Should be batched or parallelized.', 'high', 'open', 'Performance Team'),
  ('Email notifications sent twice', 'Every action that triggers an email is firing the webhook twice. Duplicate emails confirmed in SendGrid logs.', 'high', 'open', 'Support'),
  ('CSV export includes deleted records', 'Soft-deleted rows are not filtered out when exporting to CSV. Customers are seeing data they should not.', 'high', 'open', 'Alice'),
  ('Password reset link expires immediately', 'Reset tokens are being validated against the wrong timestamp column. Links are dead on arrival.', 'critical', 'triaged', 'Bob'),
  ('Sidebar nav collapses randomly on scroll', 'On screens narrower than 1280px the sidebar closes itself mid-scroll. Reproducible on Chrome and Firefox.', 'medium', 'open', 'Carol'),
  ('Search returns results for other tenants', 'Full-text search is missing a tenant_id filter. Users can see titles from other orgs.', 'critical', 'open', 'Security Audit'),
  ('Date picker breaks for dates before 1970', 'Unix epoch conversion underflows for pre-1970 dates. Field clears itself silently.', 'medium', 'open', 'QA Team'),
  ('Drag-and-drop reorder loses last item', 'Reordering list items via DnD drops the last element from state on every other drop.', 'medium', 'open', 'Alice'),
  ('404 page redirects to login loop', 'Hitting any unknown route redirects to /login, which redirects back to the unknown route indefinitely.', 'high', 'triaged', 'Bob'),
  ('Avatar upload silently fails over 1MB', 'Files over 1MB get no error message, spinner just stops. Server returns 413 but frontend ignores it.', 'low', 'open', 'Carol'),
  ('Markdown renderer executes script tags', 'User-supplied markdown is rendered without sanitization. XSS confirmed in staging.', 'critical', 'open', 'Security Audit'),
  ('Timezone not respected in report dates', 'All report timestamps are stored in UTC but displayed raw, so users in UTC-5 see the wrong day.', 'medium', 'open', 'Support'),
  ('Bulk delete only deletes first item', 'Selecting 10 items and clicking delete sends a single DELETE for the first ID only.', 'high', 'open', 'QA Team'),
  ('Settings page flickers on first render', 'Form fields flash their placeholder values before hydrating with saved data on every page load.', 'low', 'open', 'Alice');
