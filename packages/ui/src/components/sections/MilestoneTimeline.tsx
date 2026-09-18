// packages/ui/src/components/sections/MilestoneTimeline.tsx
"use client";

import { clsx } from "clsx";

export interface KeyDate {
  id: string;
  date: string;
  title: string;
  description?: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

export interface MilestoneTimelineProps {
  dates: KeyDate[];
  className?: string;
}

export function MilestoneTimeline({
  dates,
  className,
}: MilestoneTimelineProps) {
  return (
    <div className={clsx("relative", className)}>
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border-light md:left-1/2 md:-translate-x-1/2" />

      <div className="space-y-8">
        {dates.map((date, idx) => {
          const isLeft = idx % 2 === 0;

          return (
            <div
              key={date.id}
              className={clsx(
                "relative flex",
                isLeft ? "md:flex-row" : "md:flex-row-reverse"
              )}
            >
              {/* Timeline dot */}
              <div
                className={clsx(
                  "absolute left-0 w-8 h-8 rounded-full border-2 bg-surface-elevated z-10 flex items-center justify-center",
                  "md:left-1/2 md:-translate-x-1/2",
                  date.isCompleted && "border-green-base bg-green-base",
                  date.isActive && "border-gold-base",
                  !date.isCompleted && !date.isActive && "border-border-default"
                )}
              >
                {date.isCompleted ? (
                  <span className="text-xs text-white">✓</span>
                ) : (
                  <span
                    className={clsx(
                      "text-xs font-semibold",
                      date.isActive ? "text-gold-base" : "text-text-muted"
                    )}
                  >
                    {idx + 1}
                  </span>
                )}
              </div>

              {/* Content */}
              <div
                className={clsx(
                  "ml-12 md:ml-0 md:w-[calc(50%-2rem)]",
                  isLeft ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
                )}
              >
                <div className="bg-surface-elevated border border-border-light rounded-lg p-5">
                  <p className="font-body text-label uppercase tracking-wide text-gold-base mb-2">
                    {date.date}
                  </p>
                  <h4
                    className={clsx(
                      "font-display text-h3 mb-2",
                      date.isActive && "text-gold-base"
                    )}
                  >
                    {date.title}
                  </h4>
                  {date.description && (
                    <p className="font-body text-body-sm text-text-muted">
                      {date.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
