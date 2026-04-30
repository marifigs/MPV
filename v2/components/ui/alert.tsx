import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "@/lib/icons";
import type { HTMLAttributes } from "react";

type AlertVariant = "info" | "success" | "warning" | "danger";

const variantStyles: Record<AlertVariant, string> = {
  info: "bg-[#e8f0ff] border-[#93b4f5] text-[#1e3a8a]",
  success: "bg-[#e8f5ec] border-[var(--green-soft)] text-[var(--green-deep)]",
  warning: "bg-[#fef9ec] border-[var(--warning)] text-[#7c5a10]",
  danger: "bg-[#fde8e8] border-[var(--danger)] text-[#7a1a1a]",
};

const VariantIcon = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
} satisfies Record<AlertVariant, React.ComponentType<{ className?: string }>>;

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
}

export function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  const Icon = VariantIcon[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-[var(--radius-md)] border p-4 text-sm",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0 opacity-80" />
      <div>
        {title && <p className="mb-1 font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}
