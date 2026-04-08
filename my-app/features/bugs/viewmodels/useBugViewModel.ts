"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/shared/supabase/client";
import { Bug, BugSeverity } from "@/features/backlog/models/types";
import { Engineer } from "@/shared/context/EngineerContext";

interface UseBugViewModel {
  bug: Bug | null;
  loading: boolean;
  error: string | null;
  updateNotes: (notes: string) => Promise<void>;
  claimBug: (engineer: Engineer) => Promise<void>;
  unclaimBug: () => Promise<void>;
  updateSeverity: (severity: BugSeverity) => Promise<void>;
  dismissBug: () => Promise<void>;
  resolveBug: () => Promise<void>;
}

export function useBugViewModel(bugId: string): UseBugViewModel {
  const [bug, setBug] = useState<Bug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBug = useCallback(async () => {
    setLoading(true);
    setError(null);
    const client = createClient();
    const { data, error: fetchError } = await client
      .from("bugs")
      .select("*")
      .eq("id", bugId)
      .single();

    if (fetchError) setError(fetchError.message);
    else setBug(data);
    setLoading(false);
  }, [bugId]);

  useEffect(() => { fetchBug(); }, [fetchBug]);

  const patch = useCallback(async (fields: Partial<Bug>) => {
    const client = createClient();
    const { data, error: updateError } = await client
      .from("bugs")
      .update(fields)
      .eq("id", bugId)
      .select()
      .single();

    if (updateError) { setError(updateError.message); fetchBug(); }
    else setBug(data);
  }, [bugId, fetchBug]);

  const updateNotes = useCallback((notes: string) => patch({ notes }), [patch]);

  const claimBug = useCallback((engineer: Engineer) =>
    patch({ assigned_engineer_id: engineer.id, assigned_engineer_name: engineer.name, status: "in_progress" }),
  [patch]);

  const unclaimBug = useCallback(() =>
    patch({ assigned_engineer_id: null, assigned_engineer_name: null, status: bug?.status === "in_progress" ? "triaged" : "open" }),
  [patch, bug?.status]);

  const updateSeverity = useCallback((severity: BugSeverity) =>
    patch({ severity, status: "triaged" }),
  [patch]);

  const dismissBug = useCallback(async () => {
    const client = createClient();
    const { error: deleteError } = await client
      .from("bugs")
      .delete()
      .eq("id", bugId);
    if (deleteError) setError(deleteError.message);
  }, [bugId]);

  const resolveBug = useCallback(() =>
    patch({ status: "resolved", resolved_at: new Date().toISOString() }),
  [patch]);

  return { bug, loading, error, updateNotes, claimBug, unclaimBug, updateSeverity, dismissBug, resolveBug };
}
