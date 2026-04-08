"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/shared/supabase/client";

export interface Engineer {
  id: string;
  name: string;
}

interface EngineerContextValue {
  engineer: Engineer | null;
  engineers: Engineer[];
  setEngineer: (engineer: Engineer | null) => void;
  createEngineer: (name: string) => Promise<Engineer | null>;
}

const EngineerContext = createContext<EngineerContextValue>({
  engineer: null,
  engineers: [],
  setEngineer: () => {},
  createEngineer: async () => null,
});

export function EngineerProvider({ children }: { children: React.ReactNode }) {
  const [engineer, setEngineerState] = useState<Engineer | null>(null);
  const [engineers, setEngineers] = useState<Engineer[]>([]);

  // Load engineers list from Supabase
  useEffect(() => {
    const client = createClient();
    client
      .from("engineers")
      .select("id, name")
      .order("name")
      .then(({ data }) => {
        if (data) setEngineers(data);
      });
  }, []);

  // Restore saved engineer from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("current_engineer");
    if (saved) {
      try {
        setEngineerState(JSON.parse(saved));
      } catch {
        localStorage.removeItem("current_engineer");
      }
    }
  }, []);

  function setEngineer(eng: Engineer | null) {
    setEngineerState(eng);
    if (eng) {
      localStorage.setItem("current_engineer", JSON.stringify(eng));
    } else {
      localStorage.removeItem("current_engineer");
    }
  }

  async function createEngineer(name: string): Promise<Engineer | null> {
    const client = createClient();
    const { data, error } = await client
      .from("engineers")
      .insert({ name: name.trim() })
      .select("id, name")
      .single();

    if (error || !data) return null;

    setEngineers((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    return data;
  }

  return (
    <EngineerContext.Provider value={{ engineer, engineers, setEngineer, createEngineer }}>
      {children}
    </EngineerContext.Provider>
  );
}

export function useEngineer() {
  return useContext(EngineerContext);
}
