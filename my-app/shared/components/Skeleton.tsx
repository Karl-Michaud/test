const COL_WIDTHS = ["w-full", "w-2/3", "w-1/2", "w-3/4", "w-full", "w-5/6", "w-2/5"];

export function SkeletonLine({
  width = "w-full",
  height = "h-4",
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div
      className={`${width} ${height} rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse`}
    />
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-100 dark:bg-zinc-900">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <SkeletonLine width="w-16" height="h-3" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="bg-white dark:bg-zinc-950">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-3">
                  <SkeletonLine
                    width={COL_WIDTHS[(rowIdx + colIdx) % COL_WIDTHS.length]}
                    height="h-4"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-6">
      {/* title */}
      <SkeletonLine width="w-2/3" height="h-7" />
      {/* badges row */}
      <div className="flex gap-2">
        <SkeletonLine width="w-16" height="h-5" />
        <SkeletonLine width="w-20" height="h-5" />
      </div>
      {/* metadata grid */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <SkeletonLine width="w-full" height="h-3" />
            <SkeletonLine width="w-3/4" height="h-4" />
          </div>
        ))}
      </div>
      {/* description lines */}
      <div className="space-y-2">
        <SkeletonLine width="w-full" height="h-4" />
        <SkeletonLine width="w-5/6" height="h-4" />
        <SkeletonLine width="w-4/5" height="h-4" />
      </div>
    </div>
  );
}
