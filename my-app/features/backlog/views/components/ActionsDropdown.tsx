"use client";

import { useEffect, useRef, useState } from "react";

export interface DropdownAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface ActionsDropdownProps {
  actions: DropdownAction[];
}

export function ActionsDropdown({ actions }: ActionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors px-1"
        aria-label="Actions"
      >
        •••
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-36 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg py-1">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => { action.onClick(); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                action.variant === "danger"
                  ? "text-red-600 dark:text-red-400"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
