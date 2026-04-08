"use client";

import { useRouter } from "next/navigation";
import { useHistoryViewModel } from "@/features/history/viewmodels/useHistoryViewModel";
import { HistoryTable } from "@/features/history/views/components/HistoryTable";
import { SkeletonTable } from "@/shared/components/Skeleton";

export function HistoryView() {
  const router = useRouter();
  const { bugs, loading, error } = useHistoryViewModel();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          History
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {loading ? "\u00a0" : `${bugs.length} resolved or dismissed bug${bugs.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <SkeletonTable rows={5} columns={7} />
      ) : (
        <HistoryTable bugs={bugs} onRowClick={(bug) => router.push(`/bugs/${bug.id}`)} />
      )}
    </div>
  );
}
