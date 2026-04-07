CREATE TABLE bugs (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                  TEXT NOT NULL,
  description            TEXT,
  severity               bug_severity NOT NULL DEFAULT 'medium',
  status                 bug_status   NOT NULL DEFAULT 'open',
  reporter_name          TEXT,
  assigned_engineer_id   UUID REFERENCES engineers(id) ON DELETE SET NULL,
  assigned_engineer_name TEXT,
  notes                  TEXT,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW(),
  resolved_at            TIMESTAMPTZ
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bugs_updated_at
BEFORE UPDATE ON bugs
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
