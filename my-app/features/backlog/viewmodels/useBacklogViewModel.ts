"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/shared/supabase/client";
import { Bug, BugSeverity } from "@/features/backlog/models/types";
import { Engineer } from "@/shared/context/EngineerContext";

interface UseBacklogViewModel {
  bugs: Bug[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  claimBug: (bugId: string, engineer: Engineer) => Promise<void>;
  unclaimBug: (bugId: string) => Promise<void>;
  updateSeverity: (bugId: string, severity: BugSeverity) => Promise<void>;
  triageBug: (bugId: string) => Promise<void>;
  dismissBug: (bugId: string) => Promise<void>;
}

export function useBacklogViewModel(): UseBacklogViewModel {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bugsRef = useRef<Bug[]>([]);

  const fetchBugs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const client = createClient();
    const { data, error: fetchError } = await client
      .from("bugs")
      .select("*")
      .not("status", "in", '("resolved","dismissed")')
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      bugsRef.current = data ?? [];
      setBugs(data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  const claimBug = useCallback(async (bugId: string, engineer: Engineer) => {
    // Optimistic update
    const updated = bugsRef.current.map((b) =>
      b.id === bugId
        ? { ...b, assigned_engineer_id: engineer.id, assigned_engineer_name: engineer.name, status: "in_progress" as const }
        : b
    );
    bugsRef.current = updated;
    setBugs(updated);

    const client = createClient();
    const { error: updateError } = await client
      .from("bugs")
      .update({
        assigned_engineer_id: engineer.id,
        assigned_engineer_name: engineer.name,
        status: "in_progress",
      })
      .eq("id", bugId);

    if (updateError) {
      setError(updateError.message);
      fetchBugs(); // rollback
    }
  }, [fetchBugs]);

  const unclaimBug = useCallback(async (bugId: string) => {
    // Optimistic update — revert to triaged if it was in_progress, else open
    const bug = bugsRef.current.find((b) => b.id === bugId);
    const revertStatus = bug?.status === "in_progress" ? "triaged" : "open";

    const updated = bugsRef.current.map((b) =>
      b.id === bugId
        ? { ...b, assigned_engineer_id: null, assigned_engineer_name: null, status: revertStatus as Bug["status"] }
        : b
    );
    bugsRef.current = updated;
    setBugs(updated);

    const client = createClient();
    const { error: updateError } = await client
      .from("bugs")
      .update({
        assigned_engineer_id: null,
        assigned_engineer_name: null,
        status: revertStatus,
      })
      .eq("id", bugId);

    if (updateError) {
      setError(updateError.message);
      fetchBugs(); // rollback
    }
  }, [fetchBugs]);

  const updateSeverity = useCallback(async (bugId: string, severity: BugSeverity) => {
    const updated = bugsRef.current.map((b) =>
      b.id === bugId ? { ...b, severity, status: "triaged" as const } : b
    );
    bugsRef.current = updated;
    setBugs(updated);

    const client = createClient();
    const { error: updateError } = await client
      .from("bugs")
      .update({ severity, status: "triaged" })
      .eq("id", bugId);

    if (updateError) {
      setError(updateError.message);
      fetchBugs();
    }
  }, [fetchBugs]);

  const triageBug = useCallback(async (bugId: string) => {
    const updated = bugsRef.current.map((b) =>
      b.id === bugId ? { ...b, status: "triaged" as const } : b
    );
    bugsRef.current = updated;
    setBugs(updated);

    const client = createClient();
    const { error: updateError } = await client
      .from("bugs")
      .update({ status: "triaged" })
      .eq("id", bugId);

    if (updateError) {
      setError(updateError.message);
      fetchBugs();
    }
  }, [fetchBugs]);

  const dismissBug = useCallback(async (bugId: string) => {
    const updated = bugsRef.current.filter((b) => b.id !== bugId);
    bugsRef.current = updated;
    setBugs(updated);

    const client = createClient();
    const { error: deleteError } = await client
      .from("bugs")
      .delete()
      .eq("id", bugId);

    if (deleteError) {
      setError(deleteError.message);
      fetchBugs();
    }
  }, [fetchBugs]);

  return { bugs, loading, error, refresh: fetchBugs, claimBug, unclaimBug, updateSeverity, triageBug, dismissBug };
}
