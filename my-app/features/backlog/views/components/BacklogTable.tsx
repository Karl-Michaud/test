"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/components/DataTable";
import { SeveritySelect } from "@/shared/components/SeveritySelect";
import { Bug, BugSeverity, BugStatus } from "@/features/backlog/models/types";

const SEVERITY_STYLES: Record<BugSeverity, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const STATUS_STYLES: Record<BugStatus, string> = {
  open: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  triaged: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  resolved: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  dismissed: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
};

const STATUS_LABELS: Record<BugStatus, string> = {
  open: "Open",
  triaged: "Triaged",
  in_progress: "In Progress",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

function Badge({ text, className }: { text: string; className: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${className}`}>
      {text}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface BacklogTableProps {
  bugs: Bug[];
  onUpdateSeverity?: (bugId: string, severity: BugSeverity) => void;
  actionSlot?: (bug: Bug) => React.ReactNode;
}

export function BacklogTable({ bugs, onUpdateSeverity, actionSlot }: BacklogTableProps) {
  const columns: ColumnDef<Bug, unknown>[] = [
    {
      accessorKey: "title",
      header: "Title",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      enableSorting: true,
      cell: ({ row }) =>
        onUpdateSeverity ? (
          <SeveritySelect
            bugId={row.original.id}
            current={row.original.severity}
            onUpdate={onUpdateSeverity}
          />
        ) : (
          <Badge
            text={row.original.severity}
            className={SEVERITY_STYLES[row.original.severity]}
          />
        ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => (
        <Badge
          text={STATUS_LABELS[row.original.status]}
          className={STATUS_STYLES[row.original.status]}
        />
      ),
    },
    {
      accessorKey: "assigned_engineer_name",
      header: "Assignee",
      enableSorting: true,
      cell: ({ row }) => (
        <span className={row.original.assigned_engineer_name ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500 italic"}>
          {row.original.assigned_engineer_name ?? "Unassigned"}
        </span>
      ),
    },
    {
      accessorKey: "reporter_name",
      header: "Reporter",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-zinc-600 dark:text-zinc-400">
          {row.original.reporter_name ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
          {formatDate(row.original.created_at)}
        </span>
      ),
    },
    ...(actionSlot
      ? [
          {
            id: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }: { row: { original: Bug } }) => actionSlot(row.original),
          } as ColumnDef<Bug, unknown>,
        ]
      : []),
  ];

  return (
    <DataTable
      columns={columns}
      data={bugs}
      getRowId={(row) => row.id}
      emptyMessage="No bugs in the backlog."
    />
  );
}
