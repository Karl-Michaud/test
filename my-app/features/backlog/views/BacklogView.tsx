"use client";

import { useBacklogViewModel } from "@/features/backlog/viewmodels/useBacklogViewModel";
import { BacklogTable } from "@/features/backlog/views/components/BacklogTable";

export function BacklogView() {
  const { bugs, loading, error } = useBacklogViewModel();

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
        <BacklogTable bugs={bugs} />
      )}
    </div>
  );
}
