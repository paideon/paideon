"use client";
import { useEffect } from "react";

import { cn } from "../../utilities/cn";

export type ToastVariant = "success" | "error" | "warning";

export interface ToastProps {
  variant: ToastVariant;
  message: string;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  dismissLabel?: string;
}

const TOAST_STYLES: Record<
  ToastVariant,
  { bg: string; border: string; text: string; icon: string }
> = {
  success: {
    bg: "bg-semantic-success-surface",
    border: "border-semantic-success-base",
    text: "text-semantic-success-base",
    icon: "✓",
  },
  error: {
    bg: "bg-semantic-error-surface",
    border: "border-semantic-error-base",
    text: "text-semantic-error-base",
    icon: "✕",
  },
  warning: {
    bg: "bg-semantic-warning-surface",
    border: "border-semantic-warning-base",
    text: "text-semantic-warning-base",
    icon: "!",
  },
};

export function Toast({
  variant,
  message,
  visible,
  onDismiss,
  duration = 5000,
  dismissLabel = "Dismiss notification",
}: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onDismiss]);

  const s = TOAST_STYLES[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "fixed bottom-space-6 right-space-6 z-toast",
        "flex items-center gap-space-3 p-space-3.5",
        "min-w-[280px] max-w-[400px]",
        s.bg,
        s.border,
        "border shadow-elevation-2",
        "transition-all duration-gentle ease-out",
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-6 opacity-0 pointer-events-none"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "w-5 h-5 rounded-full border-[1.5px] border-current",
          "flex items-center justify-center",
          s.text,
          "text-xs font-bold flex-shrink-0"
        )}
      >
        {s.icon}
      </span>
      <p className={cn("font-body text-body-sm flex-1", s.text)}>{message}</p>
      <button
        onClick={onDismiss}
        aria-label={dismissLabel}
        className={cn(
          "bg-transparent border-none cursor-pointer",
          s.text,
          "opacity-50 text-sm p-0.5 leading-none",
          "transition-opacity duration-fast hover:opacity-100"
        )}
      >
        ✕
      </button>
    </div>
  );
}
