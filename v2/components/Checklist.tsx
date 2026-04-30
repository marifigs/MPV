"use client";

import { useState, useEffect, useCallback } from "react";
import { Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface ChecklistItem {
  id: string;
  label: string;
  sublabel?: string;
}

interface ChecklistProps {
  items: ChecklistItem[];
  storageKey: string;
  title?: string;
  className?: string;
}

export function Checklist({ items, storageKey, title, className }: ChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setChecked(new Set(JSON.parse(stored) as string[]));
      }
    } catch {
      // ignore parse errors
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
          localStorage.setItem(storageKey, JSON.stringify([...next]));
        } catch {
          // ignore storage errors
        }
        return next;
      });
    },
    [storageKey]
  );

  const resetAll = useCallback(() => {
    setChecked(new Set());
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  const doneCount = checked.size;
  const total = items.length;

  if (!mounted) return null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[var(--ink)]">{title}</h3>
          <span className="text-sm text-[var(--ink-soft)]">
            {doneCount}/{total}
          </span>
        </div>
      )}

      {/* Progress bar */}
      {total > 0 && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--rule)]">
          <div
            className="h-full rounded-full bg-[var(--green-deep)] transition-all duration-300"
            style={{ width: `${(doneCount / total) * 100}%` }}
            role="progressbar"
            aria-valuenow={doneCount}
            aria-valuemin={0}
            aria-valuemax={total}
          />
        </div>
      )}

      <ul className="flex flex-col divide-y divide-[var(--rule)]">
        {items.map((item) => {
          const done = checked.has(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 py-3 text-left transition-colors",
                  "hover:bg-[var(--surface-raised)] -mx-1 rounded-[var(--radius-sm)] px-1"
                )}
                aria-pressed={done}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
                    done
                      ? "border-[var(--green-deep)] bg-[var(--green-deep)]"
                      : "border-[var(--rule)] bg-[var(--surface)]"
                  )}
                  aria-hidden
                >
                  {done && <Check className="size-3 text-white" />}
                </span>
                <span className="flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      done ? "text-[var(--ink-soft)] line-through" : "text-[var(--ink)]"
                    )}
                  >
                    {item.label}
                  </span>
                  {item.sublabel && (
                    <span className="text-xs text-[var(--ink-soft)]">{item.sublabel}</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {doneCount > 0 && (
        <button
          type="button"
          onClick={resetAll}
          className="self-end text-xs text-[var(--ink-soft)] underline-offset-2 hover:underline"
        >
          Reiniciar
        </button>
      )}
    </div>
  );
}
