"use client";

import { useRutinaDiaria } from "@/hooks/useRutinaDiaria";
import { Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface RutinaItem {
  id: string;
  label: string;
  sublabel?: string;
}

interface DailyChecklistProps {
  items: RutinaItem[];
  storageKey: string;
  title: string;
}

export function DailyChecklist({ items, storageKey, title }: DailyChecklistProps) {
  const { checked, toggle, reset, mounted } = useRutinaDiaria(storageKey);

  if (!mounted) return null;

  const doneCount = items.filter((i) => checked.has(i.id)).length;
  const total = items.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--ink)]">{title}</h3>
        <span className="text-sm text-[var(--ink-soft)]">{doneCount}/{total}</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--rule)]">
        <div
          className="h-full rounded-full bg-[var(--green-deep)] transition-all duration-300"
          style={{ width: `${total > 0 ? (doneCount / total) * 100 : 0}%` }}
          role="progressbar"
          aria-valuenow={doneCount}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>

      <ul className="flex flex-col divide-y divide-[var(--rule)]">
        {items.map((item) => {
          const done = checked.has(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="-mx-1 flex w-[calc(100%+0.5rem)] items-center gap-3 rounded-[var(--radius-sm)] px-1 py-3 text-left transition-colors hover:bg-[var(--surface-raised)]"
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
          onClick={reset}
          className="self-end text-xs text-[var(--ink-soft)] underline-offset-2 hover:underline"
        >
          Reiniciar
        </button>
      )}
    </div>
  );
}
