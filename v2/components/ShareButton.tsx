"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  text?: string;
  className?: string;
}

export function ShareButton({ title, text, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User cancelled or share failed — fall through to copy
      }
      return;
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "URL copiada" : "Compartir ficha"}
      className={cn(
        "inline-flex min-h-[40px] items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)] px-3 text-sm text-[var(--ink-soft)] transition-colors hover:border-[var(--green-soft)] hover:text-[var(--ink)]",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="size-4 text-[var(--success)]" aria-hidden />
          Copiado
        </>
      ) : (
        <>
          {typeof navigator !== "undefined" && "share" in navigator ? (
            <Share2 className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          Compartir
        </>
      )}
    </button>
  );
}
