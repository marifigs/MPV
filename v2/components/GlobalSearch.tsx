"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Leaf } from "@/lib/icons";
import type { Plant, CareGroup } from "@/types";

interface GlobalSearchProps {
  plants: Plant[];
  careGroupMap: Record<string, CareGroup>;
}

export function GlobalSearch({ plants, careGroupMap }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Plant[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const fuseRef = useRef<import("fuse.js").default<Plant> | null>(null);
  const router = useRouter();

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else { setQuery(""); setResults([]); }
  }, [open]);

  const search = useCallback(async (value: string) => {
    setQuery(value);
    if (!value.trim()) { setResults([]); return; }

    if (!fuseRef.current) {
      const Fuse = (await import("fuse.js")).default;
      fuseRef.current = new Fuse(plants, {
        keys: ["nombre", "sku", "grupo"],
        threshold: 0.35,
        minMatchCharLength: 2,
      });
    }
    setResults(fuseRef.current.search(value).slice(0, 8).map((r) => r.item));
  }, [plants]);

  const select = useCallback((plant: Plant) => {
    setOpen(false);
    router.push(`/plantas/${plant.sku}`);
  }, [router]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar plantas (Ctrl+K)"
        className="inline-flex min-h-[40px] items-center gap-2 rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)] px-3 text-sm text-[var(--ink-soft)] transition-colors hover:border-[var(--green-soft)]"
      >
        <Search className="size-4" aria-hidden />
        <span className="hidden sm:inline">Buscar plantas...</span>
        <kbd className="hidden rounded border border-[var(--rule)] bg-[var(--surface-raised)] px-1.5 py-0.5 text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-16"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      role="dialog"
      aria-modal
      aria-label="Búsqueda global"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-[var(--radius-lg)] border border-[var(--rule)] bg-[var(--surface)] shadow-[var(--shadow-lg)]">
        <div className="flex items-center gap-2 border-b border-[var(--rule)] px-4 py-3">
          <Search className="size-4 shrink-0 text-[var(--ink-soft)]" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder="Buscar por nombre, SKU o grupo..."
            className="flex-1 bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded p-1 text-[var(--ink-soft)] hover:text-[var(--ink)]"
            aria-label="Cerrar búsqueda"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        {results.length > 0 && (
          <ul className="max-h-72 divide-y divide-[var(--rule)] overflow-y-auto">
            {results.map((plant) => {
              const care = careGroupMap[plant.grupo];
              return (
                <li key={plant.sku}>
                  <button
                    type="button"
                    onClick={() => select(plant)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--surface-raised)]"
                  >
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)]"
                      style={{ background: care ? `${care.color}18` : "#f0f0f0" }}
                      aria-hidden
                    >
                      <Leaf className="size-4 opacity-60" style={{ color: care?.color }} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--ink)]">
                        {plant.nombre}
                      </p>
                      <p className="text-xs text-[var(--ink-soft)]">
                        {care?.nombre ?? plant.grupo} · SKU {plant.sku}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {query && results.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-[var(--ink-soft)]">
            Sin resultados para &ldquo;{query}&rdquo;
          </p>
        )}

        {!query && (
          <p className="px-4 py-4 text-xs text-[var(--ink-soft)]">
            Escribe para buscar entre {plants.length} plantas
          </p>
        )}
      </div>
    </div>
  );
}
