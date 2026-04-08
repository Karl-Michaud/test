"use client";

import { BugSeverity } from "@/features/backlog/models/types";

const SEVERITIES: { label: string; value: BugSeverity }[] = [
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const SEVERITY_COLORS: Record<BugSeverity, string> = {
  critical: "text-red-600 dark:text-red-400",
  high:     "text-amber-600 dark:text-amber-400",
  medium:   "text-blue-600 dark:text-blue-400",
  low:      "text-zinc-500 dark:text-zinc-400",
};

interface SeveritySelectProps {
  bugId: string;
  current: BugSeverity;
  onUpdate: (bugId: string, severity: BugSeverity) => void;
}

export function SeveritySelect({ bugId, current, onUpdate }: SeveritySelectProps) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as BugSeverity;
    if (value !== current) onUpdate(bugId, value);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className={`text-sm rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400 font-medium ${SEVERITY_COLORS[current]}`}
    >
      {SEVERITIES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
