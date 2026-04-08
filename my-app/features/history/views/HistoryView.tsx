"use client";

import { useHistoryViewModel } from "@/features/history/viewmodels/useHistoryViewModel";
import { HistoryTable } from "@/features/history/views/components/HistoryTable";

export function HistoryView() {
  const { bugs, loading, error } = useHistoryViewModel();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          History
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {loading ? "Loading…" : `${bugs.length} resolved or dismissed bug${bugs.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-zinc-400 dark:text-zinc-500">
          Loading history…
        </div>
      ) : (
        <HistoryTable bugs={bugs} />
      )}
    </div>
  );
}
