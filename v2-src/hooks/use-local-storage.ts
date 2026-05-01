'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * SSR-safe localStorage hook con sincronización entre tabs.
 * Devuelve el valor inicial hasta que el efecto de hidratación corre,
 * para evitar flicker o mismatch de hidratación en componentes server.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (next: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore: corrupted JSON
    }
    setHydrated(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // ignore quota errors
        }
        return resolved;
      });
    },
    [key]
  );

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== key || e.newValue === null) return;
      try {
        setValue(JSON.parse(e.newValue) as T);
      } catch {
        // ignore
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [value, update, hydrated];
}
