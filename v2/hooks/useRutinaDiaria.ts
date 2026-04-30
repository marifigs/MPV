"use client";

import { useState, useEffect, useCallback } from "react";

interface RutinaState {
  date: string; // YYYY-MM-DD
  checked: string[];
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useRutinaDiaria(storageKey: string) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const state = JSON.parse(raw) as RutinaState;
        // Auto-reset if it's a new day
        if (state.date === todayISO()) {
          setChecked(new Set(state.checked));
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, [storageKey]);

  const toggle = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        try {
          const state: RutinaState = {
            date: todayISO(),
            checked: [...next],
          };
          localStorage.setItem(storageKey, JSON.stringify(state));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [storageKey]
  );

  const reset = useCallback(() => {
    setChecked(new Set());
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  return { checked, toggle, reset, mounted };
}
