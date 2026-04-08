export type BugSeverity = "critical" | "high" | "medium" | "low";
export type BugStatus = "open" | "triaged" | "in_progress" | "resolved" | "dismissed";

export interface Bug {
  id: string;
  title: string;
  description: string | null;
  severity: BugSeverity;
  status: BugStatus;
  reporter_name: string | null;
  assigned_engineer_id: string | null;
  assigned_engineer_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}
