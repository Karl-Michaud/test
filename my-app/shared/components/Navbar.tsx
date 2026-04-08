"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EngineerSelector } from "./EngineerSelector";

const LINKS = [
  { href: "/backlog", label: "Backlog" },
  { href: "/my-bugs", label: "My Bugs" },
  { href: "/history", label: "History" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="flex items-center gap-6 px-6 h-14 w-full">
        <span className="flex items-center gap-1.5 text-sm font-semibold font-mono text-red-600 dark:text-red-500">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
          Bug Tracker
        </span>
        <span className="text-zinc-300 dark:text-zinc-700 select-none">|</span>
        {LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors border-b-2 pb-px ${
                active
                  ? "text-zinc-900 dark:text-zinc-100 font-medium border-zinc-900 dark:border-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border-transparent"
              }`}
            >
              {label}
            </Link>
          );
        })}
        <div className="ml-auto">
          <EngineerSelector />
        </div>
      </div>
    </nav>
  );
}
