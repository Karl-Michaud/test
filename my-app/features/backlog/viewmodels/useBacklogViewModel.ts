"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/shared/supabase/client";
import { Bug } from "@/features/backlog/models/types";

interface UseBacklogViewModel {
  bugs: Bug[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useBacklogViewModel(): UseBacklogViewModel {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setBugs(data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  return { bugs, loading, error, refresh: fetchBugs };
}
