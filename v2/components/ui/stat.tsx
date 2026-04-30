import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
}

export function Stat({ className, label, value, unit, trend, ...props }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--ink-soft)]">
        {label}
      </span>
      <span className="flex items-baseline gap-1">
        <span
          className={cn(
            "text-2xl font-semibold tabular-nums",
            trend === "up" && "text-[var(--success)]",
            trend === "down" && "text-[var(--danger)]",
            (!trend || trend === "neutral") && "text-[var(--ink)]"
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm text-[var(--ink-soft)]">{unit}</span>
        )}
      </span>
    </div>
  );
}
