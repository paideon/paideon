// packages/ui/src/components/visualization/ProgressArc.tsx
"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "../../utilities/cn";

export interface ProgressArcProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  label?: string;
  animate?: boolean;
  variant?: "green" | "gold";
  className?: string;
}

const variantColors = {
  green: { stroke: "var(--color-green-base)", track: "var(--border-light)" },
  gold: { stroke: "var(--color-gold-base)", track: "var(--border-light)" },
};

export function ProgressArc({
  value,
  size = 120,
  strokeWidth = 6,
  showPercentage = true,
  label,
  animate = true,
  variant = "green",
  className,
}: ProgressArcProps) {
  const [progress, setProgress] = useState(animate ? 0 : value);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const colors = variantColors[variant];

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (!animate || animated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animated.current = true;
          const duration = 1500;
          const startTime = performance.now();

          const animateProgress = (now: number) => {
            const elapsed = now - startTime;
            const p = Math.min(1, elapsed / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setProgress(value * eased);
            if (p < 1) requestAnimationFrame(animateProgress);
          };
          requestAnimationFrame(animateProgress);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate, value]);

  useEffect(() => {
    if (!animate) setProgress(value);
  }, [animate, value]);

  const displayValue = Math.round(animate ? progress : value);

  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center justify-center", className)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size * 1.2}
          height={size * 1.2}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.track}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-75 ease-out"
          />
        </svg>
        {showPercentage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-h2 font-semibold text-text-primary ">
              {displayValue}%
            </span>
            {label && (
              <span className="font-body text-caption uppercase tracking-caption text-text-muted">
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
