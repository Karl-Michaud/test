"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/shared/supabase/client";
import { Bug } from "@/features/backlog/models/types";

interface UseMyBugsViewModel {
  bugs: Bug[];
  loading: boolean;
  error: string | null;
  markResolved: (bugId: string) => Promise<void>;
}

export function useMyBugsViewModel(engineerId: string | null): UseMyBugsViewModel {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bugsRef = useRef<Bug[]>([]);

  const fetchBugs = useCallback(async () => {
    if (!engineerId) {
      setBugs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const client = createClient();
    const { data, error: fetchError } = await client
      .from("bugs")
      .select("*")
      .eq("assigned_engineer_id", engineerId)
      .not("status", "in", '("resolved","dismissed")')
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      bugsRef.current = data ?? [];
      setBugs(data ?? []);
    }

    setLoading(false);
  }, [engineerId]);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  const markResolved = useCallback(async (bugId: string) => {
    // Optimistic update — remove from list
    const updated = bugsRef.current.filter((b) => b.id !== bugId);
    bugsRef.current = updated;
    setBugs(updated);

    const client = createClient();
    const { error: updateError } = await client
      .from("bugs")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", bugId);

    if (updateError) {
      setError(updateError.message);
      fetchBugs(); // rollback
    }
  }, [fetchBugs]);

  return { bugs, loading, error, markResolved };
}
