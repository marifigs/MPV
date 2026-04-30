import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  // base
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium text-sm leading-none transition-all duration-200 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green-deep)] disabled:pointer-events-none disabled:opacity-50 min-h-[48px] px-5",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--green-deep)] text-white hover:bg-[#234a30] active:scale-[0.98] shadow-sm",
        secondary:
          "bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)] hover:bg-[var(--surface-raised)] hover:border-[var(--green-soft)] active:scale-[0.98]",
        ghost:
          "bg-transparent text-[var(--ink-soft)] hover:bg-[var(--surface-raised)] hover:text-[var(--ink)] active:scale-[0.98]",
        danger:
          "bg-[var(--danger)] text-white hover:bg-[#9a2f2f] active:scale-[0.98] shadow-sm",
      },
      size: {
        sm: "min-h-[40px] px-4 text-xs",
        md: "min-h-[48px] px-5 text-sm",
        lg: "min-h-[56px] px-7 text-base",
        icon: "min-h-[48px] min-w-[48px] w-12 h-12 p-0 rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
