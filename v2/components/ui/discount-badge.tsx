import { cn } from "@/lib/utils";
import { Percent } from "@/lib/icons";

interface DiscountBadgeProps {
  percent: number;
  className?: string;
}

export function DiscountBadge({ percent, className }: DiscountBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-[var(--terracotta)] px-2.5 py-0.5 text-xs font-bold text-white",
        className
      )}
    >
      <Percent className="size-3" aria-hidden />
      {percent}% OFF
    </span>
  );
}
