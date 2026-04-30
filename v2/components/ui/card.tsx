import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accentColor?: string;
  interactive?: boolean;
}

export function Card({ className, accentColor, interactive = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--rule)] bg-[var(--surface)] shadow-[var(--shadow-sm)]",
        interactive &&
          "cursor-pointer transition-all duration-250 hover:-translate-y-1 hover:border-[var(--green-soft)] hover:shadow-[var(--shadow-md)]",
        className
      )}
      {...props}
    >
      {accentColor && (
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: accentColor }}
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-5 pb-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-t border-[var(--rule)] px-5 py-3", className)}
      {...props}
    />
  );
}
