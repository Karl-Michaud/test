"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBacklogViewModel } from "@/features/backlog/viewmodels/useBacklogViewModel";
import { BacklogTable } from "@/features/backlog/views/components/BacklogTable";
import { useEngineer } from "@/shared/context/EngineerContext";
import { useToast } from "@/shared/context/ToastContext";
import { SkeletonTable } from "@/shared/components/Skeleton";
import { Bug, BugSeverity } from "@/features/backlog/models/types";
import { ReportBugModal } from "@/features/bugs/views/components/ReportBugModal";

export function BacklogView() {
  const router = useRouter();
  const { bugs, loading, error, refresh, claimBug, unclaimBug, updateSeverity, triageBug, dismissBug } = useBacklogViewModel();
  const { engineer } = useEngineer();
  const { addToast } = useToast();
  const [reportingOpen, setReportingOpen] = useState(false);

  function renderActions(bug: Bug) {
    const isOwnedByMe = engineer && bug.assigned_engineer_id === engineer.id;
    const isUnassigned = !bug.assigned_engineer_id;

    const options = [
      ...(bug.status === "open" ? [{ value: "triage", label: "Triage" }] : []),
      ...(engineer && isUnassigned ? [{ value: "claim", label: "Claim" }] : []),
      ...(engineer && isOwnedByMe ? [{ value: "unclaim", label: "Unclaim" }] : []),
      { value: "dismiss", label: "Dismiss" },
    ];

    async function handleAction(e: React.ChangeEvent<HTMLSelectElement>) {
      const action = e.target.value;
      e.target.value = "";
      if (action === "triage") {
        await triageBug(bug.id);
        addToast("Bug triaged", "info");
      } else if (action === "claim" && engineer) {
        await claimBug(bug.id, engineer);
        addToast("Bug claimed", "success");
      } else if (action === "unclaim") {
        await unclaimBug(bug.id);
        addToast("Bug unclaimed", "info");
      } else if (action === "dismiss") {
        await dismissBug(bug.id);
        addToast("Bug dismissed", "info");
      }
    }

    return (
      <div onClick={(e) => e.stopPropagation()}>
        <select
          defaultValue=""
          onChange={handleAction}
          className="text-sm rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400 text-zinc-700 dark:text-zinc-300"
        >
          <option value="" disabled>Actions</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Bug Backlog
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {loading ? "\u00a0" : `${bugs.length} active bug${bugs.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => setReportingOpen(true)}
          className="text-sm font-medium px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors"
        >
          Report Bug
        </button>
      </div>

      {reportingOpen && (
        <ReportBugModal
          defaultReporterName={engineer?.name ?? ""}
          onClose={() => { setReportingOpen(false); refresh(); }}
        />
      )}

      {!engineer && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400">
          Select your name in the top-right to claim bugs.
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <SkeletonTable rows={6} columns={7} />
      ) : (
        <BacklogTable
          bugs={bugs}
          onUpdateSeverity={(bugId: string, severity: BugSeverity) => updateSeverity(bugId, severity)}
          actionSlot={renderActions}
          onRowClick={(bug) => router.push(`/bugs/${bug.id}`)}
        />
      )}
    </div>
  );
}
