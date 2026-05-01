'use client';

import * as React from 'react';
import { Icons } from '@/lib/icons';
import { cn } from '@/lib/cn';

export interface ChecklistItem {
  id: string;
  label: string;
  hint?: string;
}

interface ChecklistProps {
  items: ChecklistItem[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  className?: string;
}

export function Checklist({ items, checked, onToggle, className }: ChecklistProps) {
  return (
    <ul className={cn('flex flex-col gap-2', className)}>
      {items.map((item) => {
        const isOn = !!checked[item.id];
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              aria-pressed={isOn}
              className={cn(
                'group flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors',
                'min-h-[48px]',
                isOn
                  ? 'border-[var(--color-green-soft)] bg-[var(--color-surface-2)]'
                  : 'border-[var(--color-rule)] bg-[var(--color-surface)] hover:border-[var(--color-green-soft)]'
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border',
                  isOn
                    ? 'border-[var(--color-green-deep)] bg-[var(--color-green-deep)] text-[var(--color-cream)]'
                    : 'border-[var(--color-rule)] bg-[var(--color-surface)]'
                )}
              >
                {isOn ? <Icons.check className="h-4 w-4" strokeWidth={2.5} /> : null}
              </span>
              <span className="flex flex-col">
                <span
                  className={cn(
                    'text-[15px] leading-snug',
                    isOn && 'text-[var(--color-ink-soft)] line-through'
                  )}
                >
                  {item.label}
                </span>
                {item.hint ? (
                  <span className="text-[13px] text-[var(--color-ink-soft)] mt-1">
                    {item.hint}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
