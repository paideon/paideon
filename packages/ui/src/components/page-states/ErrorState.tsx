// packages/ui/src/components/page-states/ErrorState.tsx
"use client";

import { cn } from "../../utilities/cn";
import { Button } from "../atoms/Button";
import { Text } from "../typography/Text";

export type ErrorStateVariant = "inline" | "section";

export interface ErrorStateProps {
  variant?: ErrorStateVariant;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  variant = "inline",
  message = "Something went wrong. Please try again.",
  onRetry,
  retryLabel = "Try Again",
}: ErrorStateProps) {
  const isSection = variant === "section";

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col",
        isSection
          ? "items-center text-center py-space-16 px-space-6"
          : "items-start text-left py-space-5 px-space-6",
        "bg-semantic-error-surface border border-semantic-error-base",
        "gap-space-3"
      )}
    >
      {isSection && (
        <div
          aria-hidden="true"
          className={cn(
            "w-size-10 h-size-10 rounded-full",
            "border border-semantic-error-base",
            "flex items-center justify-center",
            "text-semantic-error-base text-lg",
            "opacity-70"
          )}
        >
          !
        </div>
      )}

      <Text variant="body-sm" color="error" className="leading-relaxed">
        {message}
      </Text>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className={cn(
            "border-semantic-error-base text-semantic-error-base",
            "hover:bg-semantic-error-base hover:text-text-inverse"
          )}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
