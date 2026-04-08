"use client";

import { useMyBugsViewModel } from "@/features/my-bugs/viewmodels/useMyBugsViewModel";
import { MyBugsTable } from "@/features/my-bugs/views/components/MyBugsTable";
import { useEngineer } from "@/shared/context/EngineerContext";

export function MyBugsView() {
  const { engineer } = useEngineer();
  const { bugs, loading, error, markResolved } = useMyBugsViewModel(engineer?.id ?? null);

  if (!engineer) {
    return (
      <div className="space-y-4">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">My Bugs</h1>
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400">
          Select your name in the top-right to view your bugs.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          My Bugs
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {loading
            ? "Loading…"
            : `${bugs.length} bug${bugs.length !== 1 ? "s" : ""} assigned to ${engineer.name}`}
        </p>
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
        <MyBugsTable bugs={bugs} onMarkResolved={markResolved} />
      )}
    </div>
  );
}
