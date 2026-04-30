import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
}

export function Section({ className, title, description, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-8", className)} {...props}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2
              className="text-2xl font-semibold text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-[var(--ink-soft)]">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export function SectionGrid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
      {...props}
    />
  );
}
