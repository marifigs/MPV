import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accentColor?: string;
  interactive?: boolean;
}

export function Card({ className, accentColor, interactive = false, children, onClick, ...props }: CardProps) {
  const interactiveProps = interactive && onClick
    ? {
        role: "button" as const,
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        },
        onClick,
      }
    : { onClick };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--rule)] bg-[var(--surface)] shadow-[var(--shadow-sm)]",
        interactive &&
          "cursor-pointer transition-all duration-250 hover:-translate-y-1 hover:border-[var(--green-soft)] hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-[var(--green-deep)]",
        className
      )}
      {...props}
      {...interactiveProps}
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
