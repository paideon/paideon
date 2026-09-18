"use client";

import { useState, useEffect } from "react";

import { cn } from "../../utilities/cn";
import { Button } from "../atoms/Button";

const STORAGE_KEY = "kcc-cookie-consent";

export interface CookieConsentBannerProps {
  message?: string;
  acceptLabel?: string;
  declineLabel?: string;
}

export function CookieConsentBanner({
  message = "This website uses cookies to improve your experience. By continuing to use this site, you consent to our use of cookies.",
  acceptLabel = "Accept",
  declineLabel = "Decline",
}: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const hasConsent = localStorage.getItem(STORAGE_KEY);
      if (!hasConsent) setVisible(true);
    } catch {
      // localStorage unavailable (private browsing, blocked storage) — default to not showing the banner rather than throwing.
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // Best-effort — if storage is blocked, the banner still dismisses for this session.
    }
    setVisible(false);
  };

  const decline = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "declined");
    } catch {
      // Best-effort — see accept() above.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-toast",
        "bg-surface-inverse border-t border-gold-base/20",
        "shadow-elevation-3"
      )}
    >
      <div
        className={cn(
          "max-w-content mx-auto",
          "px-space-6 py-space-5 md:py-space-4",
          "flex flex-col md:flex-row items-center justify-between gap-space-4"
        )}
      >
        <p
          className={cn(
            "font-body text-body-sm text-text-inverse leading-relaxed",
            "text-center md:text-left"
          )}
        >
          {message}
        </p>
        <div className="flex gap-space-3 shrink-0">
          <Button onClick={accept} variant="primary" size="sm">
            {acceptLabel}
          </Button>
          <Button onClick={decline} variant="ghost" size="sm">
            {declineLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
