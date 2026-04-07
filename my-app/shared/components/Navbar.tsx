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
      <div className="flex items-center gap-6 px-6 h-12 w-full">
        <span className="text-sm font-semibold text-red-600 dark:text-red-500">
          Bug Tracker
        </span>
        <span className="text-zinc-300 dark:text-zinc-700 select-none">|</span>
        {LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                active
                  ? "text-zinc-900 dark:text-zinc-100 font-medium"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
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
