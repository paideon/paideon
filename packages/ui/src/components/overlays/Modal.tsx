"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { cn } from "../../utilities/cn";

export type ModalVariant = "confirmation" | "information";

export interface ModalProps {
  variant?: ModalVariant;
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  /** Label for the dismiss button (used for both variants — was previously a hardcoded Close/Cancel split) */
  closeLabel?: string;
  onConfirm?: () => void;
  destructive?: boolean;
  children?: React.ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  variant = "information",
  open,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  closeLabel,
  onConfirm,
  destructive = false,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const resolvedCloseLabel =
    closeLabel ?? (variant === "information" ? "Close" : "Cancel");

  useLockBodyScroll(open);

  // Escape to close, Tab trapped within the dialog, focus moved in on open
  // and restored to the trigger element on close.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    const focusables =
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusables?.[0]?.focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const nodes = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 bg-overlay-medium z-80",
          "transition-opacity duration-standard ease-out",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "fixed top-1/2 left-1/2 z-90 w-[min(520px,calc(100vw-32px))]",
          "bg-surface-elevated shadow-elevation-3",
          "transition-all duration-standard ease-out",
          open
            ? "opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2"
            : "opacity-0 scale-97 -translate-x-1/2 -translate-y-[48%] pointer-events-none"
        )}
      >
        <div
          className={cn(
            "h-1",
            destructive ? "bg-semantic-error-base" : "bg-gold-base"
          )}
        />
        <div className="p-space-8 pb-space-9">
          <h2
            id="modal-title"
            className="font-display text-h3 font-medium text-text-primary mb-space-3"
          >
            {title}
          </h2>
          {description && (
            <p className="font-body text-body text-text-muted leading-relaxed mb-space-5">
              {description}
            </p>
          )}
          {children && <div className="mb-space-7">{children}</div>}
          <div className="flex justify-end gap-space-3">
            <button
              onClick={onClose}
              className={cn(
                "px-space-6 py-space-2.5",
                "font-body text-caption uppercase tracking-caption",
                "border border-border-default bg-transparent text-text-muted",
                "transition-colors duration-fast",
                "hover:border-text-muted hover:text-text-primary",
                "focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-2"
              )}
            >
              {resolvedCloseLabel}
            </button>
            {variant === "confirmation" && (
              <button
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                className={cn(
                  "px-space-6 py-space-2.5",
                  "font-body text-caption uppercase tracking-caption text-text-inverse",
                  "transition-opacity duration-fast",
                  destructive ? "bg-semantic-error-base" : "bg-green-base",
                  "hover:opacity-85 focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-2"
                )}
              >
                {confirmLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
