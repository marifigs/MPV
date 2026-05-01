'use client';

import * as React from 'react';
import { Icons } from '@/lib/icons';
import { cn } from '@/lib/cn';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, value, onClear, ...rest }, ref) => {
    const showClear = typeof value === 'string' && value.length > 0;
    return (
      <div
        className={cn(
          'flex h-12 items-center gap-2 rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] px-3.5',
          'focus-within:border-[var(--color-green-deep)] focus-within:ring-2 focus-within:ring-[var(--color-green-deep)]/20',
          className
        )}
      >
        <Icons.search aria-hidden className="h-[18px] w-[18px] shrink-0 text-[var(--color-ink-soft)]" strokeWidth={1.75} />
        <input
          ref={ref}
          type="search"
          value={value}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)] outline-none"
          {...rest}
        />
        {showClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpiar búsqueda"
            className="grid h-9 w-9 place-items-center rounded-md text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-2)]"
          >
            <Icons.x aria-hidden className="h-4 w-4" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>
    );
  }
);
SearchBar.displayName = 'SearchBar';
