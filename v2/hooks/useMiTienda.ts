"use client";

import { useState, useEffect, useCallback } from "react";
import { storeById } from "@/lib/data";
import type { Store } from "@/types";

const STORAGE_KEY = "mi_tienda_id";

export function useMiTienda() {
  const [store, setStore] = useState<Store | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const found = storeById.get(saved);
      if (found) setStore(found);
    }
    setMounted(true);
  }, []);

  const select = useCallback((s: Store) => {
    setStore(s);
    localStorage.setItem(STORAGE_KEY, s.id);
  }, []);

  const clear = useCallback(() => {
    setStore(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { store, select, clear, mounted };
}
