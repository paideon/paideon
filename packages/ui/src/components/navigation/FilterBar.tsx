// packages/ui/src/components/feedback/FilterBar.tsx
"use client";

import type { FilterOptionData } from "@paideon/contracts";

import { cn } from "../../utilities/cn";

export type FilterBarVariant = "category-tabs" | "year-selector";

export interface FilterBarProps {
  variant?: FilterBarVariant;
  options: FilterOptionData[];
  value: string;
  onChange: (value: string) => void;
  /** Optional "All" label — shown as first tab when provided */
  allLabel?: string;
  className?: string;
}

export function FilterBar({
  variant = "category-tabs",
  options,
  value,
  onChange,
  allLabel,
  className,
}: FilterBarProps) {
  const allOption: FilterOptionData | null = allLabel
    ? { value: "", label: allLabel }
    : null;
  const allOptions = allOption ? [allOption, ...options] : options;

  // Year selector variant
  if (variant === "year-selector") {
    return (
      <div className={cn("flex flex-wrap items-center gap-space-2", className)}>
        {allOptions.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "font-body text-label uppercase tracking-label",
                "px-space-4 py-space-1p5",
                "border rounded-sm",
                "transition-all duration-fast ease-snap",
                "focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-[3px]",
                isActive
                  ? "bg-green-base border-green-base text-text-inverse"
                  : "bg-transparent border-border-default text-text-muted hover:border-green-base hover:text-gold-base"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  // Category tabs variant (default)
  return (
    <div
      className={cn(
        "flex border-b border-border-light overflow-x-auto scrollbar-none",
        className
      )}
    >
      {allOptions.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "group relative flex items-center gap-space-2",
              "px-space-5 py-space-3",
              "font-body text-label uppercase tracking-label",
              "whitespace-nowrap flex-shrink-0",
              "border-b-2 transition-all duration-fast ease-snap",
              "focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-[3px]",
              isActive
                ? "border-green-base text-text-primary bg-surface-default"
                : "border-transparent text-text-muted bg-transparent hover:text-gold-base hover:border-gold-base/40"
            )}
          >
            {opt.label}
            {opt.count !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-[18px] h-[18px] px-space-1p5",
                  "rounded-full text-[0.58rem] font-body leading-none",
                  isActive
                    ? "bg-green-base text-text-inverse"
                    : "bg-surface-deep text-text-muted group-hover:bg-gold-pale group-hover:text-gold-base"
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
