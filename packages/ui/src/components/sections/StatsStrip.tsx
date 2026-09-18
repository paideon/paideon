"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import { ReactNode } from "react";

import { useCountUp } from "../../hooks/useCountUp";
import { cn } from "../../utilities/cn";
import { Icon } from "../icons";
import { Container } from "../layout/Container";
import { Grid } from "../layout/Grid";
import { Text } from "../typography/Text";

export type StatTrendDirection = "up" | "down" | "neutral";
export type StatVariant = "default" | "compact";

type TrendProps = {
  direction: StatTrendDirection;
  value: string;
  label?: string;
};

export interface StatItem {
  id: string;
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  separator?: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  trend?: TrendProps;
  tooltip?: {
    content: string;
    position?: "top" | "bottom" | "left" | "right";
  };
  ariaLabel?: string;
  duration?: number; // seconds (will be auto‑scaled by useCountUp)
  delay?: number; // seconds
}

const TrendIndicator = ({ direction, value, label }: TrendProps) => {
  const iconConfig = {
    up: { icon: <Icon name="arrow-up" />, color: "text-semantic-success-base" },
    down: {
      icon: <Icon name="arrow-down" />,
      color: "text-semantic-error-base",
    },
    neutral: { icon: <Icon name="minus" />, color: "text-semantic-info-base" },
  };
  const { icon, color } = iconConfig[direction];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-space-1 px-space-2 py-space-0p5 rounded-full",
        "bg-surface-deep border border-border-light text-caption"
      )}
    >
      <span className={color} aria-hidden="true">
        {icon}
      </span>
      <span className={cn("font-semibold", color)}>{value}</span>
      {label && <span className="text-text-muted font-label">{label}</span>}
    </span>
  );
};

const StatCard = ({
  stat,
  variant,
  globalDuration,
  index,
}: {
  stat: StatItem;
  variant: StatVariant;
  globalDuration?: number;
  index: number;
}) => {
  const prefersReduced = useReducedMotion();

  const { value, ref: countUpRef } = useCountUp(stat.target, {
    duration: stat.duration ?? globalDuration ?? 1.8,
    delay: stat.delay ?? 0,
    animated: !prefersReduced,
    startOnVisible: true,
    threshold: 0.3,
  });

  // Reactive formatting – animated value drives the displayed string
  const formatted = useTransform(value, (v) => {
    const num = Math.floor(v);
    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, stat.separator ?? ",");
    const intPart = parts.join(".");
    return `${stat.prefix ?? ""}${intPart}${stat.suffix ?? ""}`;
  });

  const isCompact = variant === "compact";

  return (
    <motion.div
      // Cast ref to satisfy motion.div (HTMLDivElement vs HTMLElement)
      ref={countUpRef as React.RefObject<HTMLDivElement>}
      className={cn(
        "group relative flex flex-col items-center text-center",
        "bg-surface-elevated border border-border-light rounded-lg",
        "transition-all duration-gentle ease-out",
        "hover:shadow-elevation-3 hover:-translate-y-1",
        isCompact ? "p-space-5" : "p-space-7"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: prefersReduced ? 0 : 0.4,
        ease: "easeOut",
        delay: prefersReduced ? 0 : index * 0.05,
      }}
    >
      {stat.icon && (
        <div className="mb-space-3 text-gold-base group-hover:scale-110 transition-transform duration-fast">
          {stat.icon}
        </div>
      )}

      {/* MotionValue drives the number – smooth, no React state per frame */}
      <motion.span
        className={cn(
          "font-display font-medium text-gold-base",
          isCompact ? "text-h3" : "text-h2",
          "whitespace-nowrap"
        )}
      >
        {formatted}
      </motion.span>

      <Text
        variant="label"
        className={cn("mt-space-3", isCompact && "text-label-sm")}
      >
        {stat.label}
      </Text>

      {stat.description && (
        <Text
          variant="caption"
          color="muted"
          className={cn("mt-space-1", isCompact && "hidden md:block")}
        >
          {stat.description}
        </Text>
      )}

      {stat.trend && (
        <div className="mt-space-3">
          <TrendIndicator {...stat.trend} />
        </div>
      )}
    </motion.div>
  );
};

export interface StatsStripProps {
  stats?: StatItem[];
  variant?: StatVariant;
  /** Global duration in seconds (default: 1.8) – will be scaled up for very large numbers */
  duration?: number;
  className?: string;
}

export function StatsStrip({
  stats = [],
  variant = "default",
  duration,
  className,
}: StatsStripProps) {
  return (
    <Container as="section" className="w-full">
      <Grid columns={1} gap={4} className={className}>
        {stats.map((stat, idx) => (
          <StatCard
            key={stat.id}
            index={idx}
            stat={stat}
            variant={variant}
            globalDuration={duration}
          />
        ))}
      </Grid>
    </Container>
  );
}
