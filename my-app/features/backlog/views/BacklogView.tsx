"use client";

import { useBacklogViewModel } from "@/features/backlog/viewmodels/useBacklogViewModel";
import { BacklogTable } from "@/features/backlog/views/components/BacklogTable";
import { useEngineer } from "@/shared/context/EngineerContext";
import { Bug } from "@/features/backlog/models/types";

export function BacklogView() {
  const { bugs, loading, error, claimBug, unclaimBug } = useBacklogViewModel();
  const { engineer } = useEngineer();

  function renderActions(bug: Bug) {
    const isOwnedByMe = engineer && bug.assigned_engineer_id === engineer.id;
    const isUnassigned = !bug.assigned_engineer_id;

    if (!engineer) return null;

    if (isOwnedByMe) {
      return (
        <button
          onClick={() => unclaimBug(bug.id)}
          className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          Unclaim
        </button>
      );
    }

    if (isUnassigned) {
      return (
        <button
          onClick={() => claimBug(bug.id, engineer)}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          Claim
        </button>
      );
    }

    return null;
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
      </div>

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
        <BacklogTable bugs={bugs} actionSlot={renderActions} />
      )}
    </div>
  );
}
