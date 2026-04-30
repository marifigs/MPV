"use client";

import { useState, useCallback, useRef, useId } from "react";
import { Search, X } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface SearchBarProps<T> {
  items: T[];
  searchKeys: string[];
  placeholder?: string;
  onResults: (results: T[]) => void;
  className?: string;
}

export function SearchBar<T extends Record<string, unknown>>({
  items,
  searchKeys,
  placeholder = "Buscar plantas...",
  onResults,
  className,
}: SearchBarProps<T>) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const fuseRef = useRef<import("fuse.js").default<T> | null>(null);

  const initFuse = useCallback(async () => {
    if (fuseRef.current) return;
    const Fuse = (await import("fuse.js")).default;
    fuseRef.current = new Fuse(items, {
      keys: searchKeys,
      threshold: 0.35,
      minMatchCharLength: 2,
    });
  }, [items, searchKeys]);

  const handleChange = useCallback(
    async (value: string) => {
      setQuery(value);
      if (!value.trim()) {
        onResults(items);
        return;
      }
      await initFuse();
      const results = fuseRef.current!.search(value).map((r) => r.item);
      onResults(results);
    },
    [items, initFuse, onResults]
  );

  const clear = useCallback(() => {
    setQuery("");
    onResults(items);
  }, [items, onResults]);

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={inputId} className="sr-only">
        {placeholder}
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ink-soft)]"
        aria-hidden
      />
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)]",
          "py-3 pl-10 pr-10 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)]",
          "transition-colors focus:border-[var(--green-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)]/20"
        )}
      />
      {query && (
        <button
          type="button"
          onClick={clear}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--ink-soft)] hover:text-[var(--ink)]"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
