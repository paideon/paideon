"use client";

import { useState } from "react";

import { cn } from "../../utilities/cn";

export type AnnouncementVariant = "warning" | "error" | "info";

const variantStyles: Record<
  AnnouncementVariant,
  { bg: string; border: string; text: string; icon: string }
> = {
  warning: {
    bg: "bg-semantic-warning-surface",
    border: "border-semantic-warning-base",
    text: "text-semantic-warning-base",
    icon: "⚠",
  },
  error: {
    bg: "bg-semantic-error-surface",
    border: "border-semantic-error-base",
    text: "text-semantic-error-base",
    icon: "✕",
  },
  info: {
    bg: "bg-semantic-info-surface",
    border: "border-semantic-info-base",
    text: "text-semantic-info-base",
    icon: "ℹ",
  },
};

export interface AnnouncementBannerProps {
  variant?: AnnouncementVariant;
  children: React.ReactNode;
  dismissible?: boolean;
  className?: string;
  dismissLabel?: string;
}

export function AnnouncementBanner({
  variant = "info",
  children,
  dismissible = false,
  className,
  dismissLabel = "Dismiss announcement",
}: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const styles = variantStyles[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={cn(
        "flex items-center justify-between w-full",
        "px-space-6 py-space-3",
        styles.bg,
        `border-b ${styles.border}`,
        className
      )}
    >
      <div className="flex items-center gap-space-3">
        <span
          aria-hidden="true"
          className={cn("flex-shrink-0 font-body text-[0.9rem]", styles.text)}
        >
          {styles.icon}
        </span>
        <p
          className={cn(
            "font-body text-[0.85rem] leading-relaxed m-0",
            styles.text
          )}
        >
          {children}
        </p>
      </div>

      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          aria-label={dismissLabel}
          className={cn(
            "flex-shrink-0 p-space-1",
            "bg-transparent border-none cursor-pointer",
            styles.text,
            "opacity-60 hover:opacity-100",
            "transition-opacity duration-fast",
            "focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-2"
          )}
        >
          ✕
        </button>
      )}
    </div>
  );
}
