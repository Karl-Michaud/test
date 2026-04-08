"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBacklogViewModel } from "@/features/backlog/viewmodels/useBacklogViewModel";
import { BacklogTable } from "@/features/backlog/views/components/BacklogTable";
import { useEngineer } from "@/shared/context/EngineerContext";
import { Bug, BugSeverity } from "@/features/backlog/models/types";
import { ReportBugModal } from "@/features/bugs/views/components/ReportBugModal";

export function BacklogView() {
  const router = useRouter();
  const { bugs, loading, error, refresh, claimBug, unclaimBug, updateSeverity, dismissBug } = useBacklogViewModel();
  const { engineer } = useEngineer();
  const [reportingOpen, setReportingOpen] = useState(false);

  function renderActions(bug: Bug) {
    const isOwnedByMe = engineer && bug.assigned_engineer_id === engineer.id;
    const isUnassigned = !bug.assigned_engineer_id;

    const claimAction = engineer && isUnassigned ? (
      <button
        onClick={() => claimBug(bug.id, engineer)}
        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
      >
        Claim
      </button>
    ) : engineer && isOwnedByMe ? (
      <button
        onClick={() => unclaimBug(bug.id)}
        className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        Unclaim
      </button>
    ) : null;

    const dismissAction = (
      <button
        onClick={() => dismissBug(bug.id)}
        className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
      >
        Dismiss
      </button>
    );

    return (
      <div className="flex items-center gap-3">
        {claimAction}
        {dismissAction}
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
            {loading ? "Loading…" : `${bugs.length} active bug${bugs.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => setReportingOpen(true)}
          className="text-sm font-medium px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
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
        <div className="py-16 text-center text-sm text-zinc-400 dark:text-zinc-500">
          Loading bugs…
        </div>
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
