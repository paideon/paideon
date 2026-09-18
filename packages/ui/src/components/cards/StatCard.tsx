"use client";
import type {
  StatData,
  TrendDirectionType,
  StatCardVariantType,
} from "@paideon/contracts";

import { useCountUp } from "../../hooks/useCountUp";
import { cn } from "../../utilities/cn";

export interface StatCardProps extends Omit<StatData, "variant"> {
  variant?: StatCardVariantType;
  className?: string;
}

function TrendIndicator({
  direction = "neutral",
  value,
  label,
}: {
  direction?: TrendDirectionType;
  value?: string;
  label?: string;
}) {
  const config = {
    up: { symbol: "↑", color: "text-semantic-success-base" },
    down: { symbol: "↓", color: "text-semantic-error-base" },
    neutral: { symbol: "—", color: "text-text-muted" },
  };
  const { symbol, color } = config[direction] ?? config.neutral;

  return (
    <div className="inline-flex items-center gap-space-1 px-space-2 py-space-0.5 bg-surface-deep border border-border-light rounded-full">
      <span className={cn("text-sm leading-none", color)}>{symbol}</span>
      {value && (
        <span className={cn("font-body text-caption font-semibold", color)}>
          {value}
        </span>
      )}
      {label && (
        <span className="font-body text-caption uppercase tracking-caption text-text-muted">
          {label}
        </span>
      )}
    </div>
  );
}

export function StatCard({
  variant = "single",
  target,
  value,
  suffix = "",
  label,
  trend,
  trendValue,
  trendLabel,
  className,
}: StatCardProps & {
  value?: number;
  trendValue?: string;
  trendLabel?: string;
}) {
  const numericTarget = target ?? value ?? 0;
  const { ref } = useCountUp(numericTarget);

  const trendObj =
    typeof trend === "object" && trend !== null
      ? trend
      : typeof trend === "string"
      ? {
          direction: trend as TrendDirectionType,
          value: trendValue,
          label: trendLabel,
        }
      : undefined;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "p-space-7 bg-surface-elevated border border-border-light",
        "shadow-elevation-1",
        className
      )}
    >
      <p className="font-body text-caption uppercase tracking-caption text-text-muted mb-space-3">
        {label}
      </p>
      <div
        className={cn(
          "flex items-baseline gap-space-1",
          variant === "with-trend" && trendObj && "mb-space-3"
        )}
      >
        <span className="font-display text-[clamp(2rem,4vw,2.8rem)] font-medium text-gold-base leading-none">
          {numericTarget}
        </span>
        {suffix && (
          <span className="font-display text-[clamp(1rem,2vw,1.4rem)] font-medium text-gold-base/70 leading-none">
            {suffix}
          </span>
        )}
      </div>
      {variant === "with-trend" && trendObj && (
        <TrendIndicator
          direction={trendObj.direction}
          value={trendObj.value}
          label={trendObj.label}
        />
      )}
    </div>
  );
}
