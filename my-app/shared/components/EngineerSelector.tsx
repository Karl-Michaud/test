"use client";

import { useState } from "react";
import { useEngineer } from "@/shared/context/EngineerContext";

export function EngineerSelector() {
  const { engineer, engineers, setEngineer, createEngineer } = useEngineer();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === "__new__") {
      setCreating(true);
      return;
    }
    const selected = engineers.find((eng) => eng.id === value) ?? null;
    setEngineer(selected);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    setSaving(true);
    setError(null);

    const created = await createEngineer(trimmed);

    if (!created) {
      setError("Failed to create engineer.");
      setSaving(false);
      return;
    }

    setEngineer(created);
    setNewName("");
    setCreating(false);
    setSaving(false);
  }

  function handleCancel() {
    setCreating(false);
    setNewName("");
    setError(null);
  }

  if (creating) {
    return (
      <form onSubmit={handleCreate} className="flex items-center gap-1.5">
        <input
          autoFocus
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Your name"
          disabled={saving}
          className="text-xs border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 w-32"
        />
        <button
          type="submit"
          disabled={saving || !newName.trim()}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-40 transition-colors"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={saving}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          Cancel
        </button>
        {error && (
          <span className="text-xs text-red-500 dark:text-red-400">{error}</span>
        )}
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">You are:</span>
      <select
        value={engineer?.id ?? ""}
        onChange={handleSelect}
        className="text-xs bg-transparent border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-400"
      >
        <option value="">— select —</option>
        {engineers.map((eng) => (
          <option key={eng.id} value={eng.id}>
            {eng.name}
          </option>
        ))}
        <option value="__new__">+ New engineer</option>
      </select>
    </div>
  );
}
