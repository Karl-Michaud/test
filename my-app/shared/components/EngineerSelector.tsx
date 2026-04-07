"use client";

import { useEngineer } from "@/shared/context/EngineerContext";

export function EngineerSelector() {
  const { engineer, engineers, setEngineer } = useEngineer();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = engineers.find((eng) => eng.id === e.target.value) ?? null;
    setEngineer(selected);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">You are:</span>
      <select
        value={engineer?.id ?? ""}
        onChange={handleChange}
        className="text-xs bg-transparent border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-400"
      >
        <option value="">— select —</option>
        {engineers.map((eng) => (
          <option key={eng.id} value={eng.id}>
            {eng.name}
          </option>
        ))}
      </select>
    </div>
  );
}
