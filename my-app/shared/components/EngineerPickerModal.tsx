"use client";

import { useState } from "react";
import { useEngineer } from "@/shared/context/EngineerContext";

export function EngineerPickerModal() {
  const { engineer, engineers, setEngineer, createEngineer } = useEngineer();
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Dismiss once an engineer is selected
  if (engineer) return null;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    setSaving(true);
    setError(null);

    const created = await createEngineer(trimmed);
    if (!created) {
      setError("Failed to create engineer. Try again.");
      setSaving(false);
      return;
    }

    setEngineer(created);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl p-6 space-y-5">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Who are you?
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Select your name to get started.
          </p>
        </div>

        {engineers.length > 0 && (
          <ul className="space-y-1.5">
            {engineers.map((eng) => (
              <li key={eng.id}>
                <button
                  onClick={() => setEngineer(eng)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {eng.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
          {!showCreate ? (
            <button
              onClick={() => setShowCreate(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
            >
              + I&apos;m not listed — add me
            </button>
          ) : (
            <form onSubmit={handleCreate} className="space-y-2">
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your name"
                disabled={saving}
                className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50"
              />
              {error && (
                <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving || !newName.trim()}
                  className="flex-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium py-2 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 transition-colors"
                >
                  {saving ? "Saving…" : "Join as this name"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreate(false); setNewName(""); setError(null); }}
                  disabled={saving}
                  className="px-3 rounded-md text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
