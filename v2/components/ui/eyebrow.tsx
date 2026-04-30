import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Eyebrow({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-widest text-[var(--green-soft)]",
        className
      )}
      {...props}
    />
  );
}
