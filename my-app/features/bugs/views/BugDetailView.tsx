"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBugViewModel } from "@/features/bugs/viewmodels/useBugViewModel";
import { useEngineer } from "@/shared/context/EngineerContext";
import { useToast } from "@/shared/context/ToastContext";
import { SkeletonLine, SkeletonCard } from "@/shared/components/Skeleton";
import { BugSeverity, BugStatus } from "@/features/backlog/models/types";

const SEVERITY_TITLE_COLOR: Record<BugSeverity, string> = {
  critical: "text-red-600 dark:text-red-400",
  high:     "text-amber-600 dark:text-amber-400",
  medium:   "text-blue-600 dark:text-blue-400",
  low:      "text-zinc-500 dark:text-zinc-400",
};

const SEVERITY_BADGE: Record<BugSeverity, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  high:     "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  medium:   "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  low:      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const STATUS_BADGE: Record<BugStatus, string> = {
  open:        "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  triaged:     "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  resolved:    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  dismissed:   "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
};

const STATUS_LABELS: Record<BugStatus, string> = {
  open:        "Open",
  triaged:     "Triaged",
  in_progress: "In Progress",
  resolved:    "Resolved",
  dismissed:   "Dismissed",
};

function Badge({ text, className }: { text: string; className: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${className}`}>
      {text}
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-0.5">{label}</dt>
      <dd className="text-sm text-zinc-700 dark:text-zinc-300">{value}</dd>
    </div>
  );
}

interface BugDetailViewProps {
  bugId: string;
}

export function BugDetailView({ bugId }: BugDetailViewProps) {
  const router = useRouter();
  const { engineer } = useEngineer();
  const { addToast } = useToast();
  const { bug, loading, error, updateNotes, claimBug, unclaimBug, updateSeverity, dismissBug, resolveBug } = useBugViewModel(bugId);

  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const notesRef = useRef<HTMLTextAreaElement>(null);

  function startEditingNotes() {
    setNotesValue(bug?.notes ?? "");
    setEditingNotes(true);
    setTimeout(() => notesRef.current?.focus(), 0);
  }

  async function saveNotes() {
    setEditingNotes(false);
    if (notesValue !== (bug?.notes ?? "")) {
      await updateNotes(notesValue);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLine width="w-16" height="h-4" />
        <SkeletonCard />
      </div>
    );
  }

  if (error || !bug) {
    return (
      <div className="space-y-4">
        <button onClick={() => router.back()} className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          ← Back
        </button>
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error ?? "Bug not found."}
        </div>
      </div>
    );
  }

  const isOwnedByMe = engineer && bug.assigned_engineer_id === engineer.id;
  const isUnassigned = !bug.assigned_engineer_id;
  const isActive = bug.status !== "resolved" && bug.status !== "dismissed";

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        ← Back
      </button>

      {/* Title + badges */}
      <div className="space-y-2">
        <h1 className={`text-2xl font-semibold leading-snug ${SEVERITY_TITLE_COLOR[bug.severity]}`}>
          {bug.title}
        </h1>
        <div className="flex items-center gap-2">
          <Badge text={bug.severity} className={SEVERITY_BADGE[bug.severity]} />
          <Badge text={STATUS_LABELS[bug.status]} className={STATUS_BADGE[bug.status]} />
        </div>
      </div>

      {/* Metadata */}
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetaItem label="Reporter" value={bug.reporter_name ?? "—"} />
        <MetaItem label="Assignee" value={bug.assigned_engineer_name ?? "Unassigned"} />
        <MetaItem label="Created" value={formatDate(bug.created_at)} />
        <MetaItem label="Updated" value={formatDate(bug.updated_at)} />
        {bug.resolved_at && <MetaItem label="Resolved" value={formatDate(bug.resolved_at)} />}
      </dl>

      {/* Description */}
      {bug.description && (
        <div className="space-y-1">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Description</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {bug.description}
          </p>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-1">
        <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Notes</p>
        {editingNotes ? (
          <textarea
            ref={notesRef}
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            onBlur={saveNotes}
            onKeyDown={(e) => { if (e.key === "Escape") { setEditingNotes(false); } }}
            rows={4}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-none"
          />
        ) : (
          <p
            onClick={startEditingNotes}
            className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap cursor-text min-h-[2.5rem] rounded-md px-3 py-2 -mx-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            {bug.notes || <span className="text-zinc-400 dark:text-zinc-500 italic">Click to add notes…</span>}
          </p>
        )}
      </div>

      {/* Actions */}
      {isActive && (
        <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {engineer && isUnassigned && (
            <button
              onClick={async () => { await claimBug(engineer); addToast("Bug claimed", "success"); }}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Claim
            </button>
          )}
          {engineer && isOwnedByMe && (
            <>
              <button
                onClick={async () => { await unclaimBug(); addToast("Bug unclaimed", "info"); }}
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Unclaim
              </button>
              <button
                onClick={async () => { await resolveBug(); addToast("Bug resolved — nice work!", "success"); }}
                className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
              >
                Mark Resolved
              </button>
            </>
          )}
          <button
            onClick={async () => { await dismissBug(); addToast("Bug dismissed", "info"); router.push("/backlog"); }}
            className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            Dismiss
          </button>

          {/* Severity */}
          <div className="ml-auto">
            <select
              value={bug.severity}
              onChange={(e) => updateSeverity(e.target.value as BugSeverity)}
              className={`text-sm rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400 font-medium ${SEVERITY_TITLE_COLOR[bug.severity]}`}
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
