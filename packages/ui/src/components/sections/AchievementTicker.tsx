"use client";
import { useRef, useState } from "react";

import { cn } from "../../utilities/cn";

export interface Achievement {
  id: string;
  text: string;
  year?: string;
  category?: string;
}

export interface AchievementTickerProps {
  achievements: Achievement[];
  /** Link to full archive */
  archiveHref?: string;
  archiveLabel?: string;
}

export function AchievementTicker({
  achievements,
  archiveHref,
  archiveLabel = "All →",
}: AchievementTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Duplicate list for seamless loop
  const doubled = [...achievements, ...achievements];

  // Duration formula: contentWidth / 50px/s — approximated via item count
  const duration = achievements.length * 6; // ~6s per item gives ~50px/s feel

  return (
    <section className="relative overflow-hidden bg-surface-base border-t border-b border-border-light py-[18px]">
      <style>{`
        @keyframes kcc-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .kcc-ticker-track { animation: none !important; }
        }
      `}</style>

      {/* Edge fades */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 z-[2] w-20 bg-gradient-to-r from-surface-base to-transparent pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 z-[2] w-20 bg-gradient-to-l from-surface-base to-transparent pointer-events-none"
      />

      <div
        ref={trackRef}
        className={cn(
          "kcc-ticker-track flex items-center gap-0 w-max transition-opacity duration-200",
          paused ? "opacity-75" : "opacity-100"
        )}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          // Genuinely dynamic — duration depends on item count, play state depends on hover.
          animation: `kcc-ticker ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {doubled.map((item, i) => (
          <span key={`${item.id}-${i}`} className="flex items-center">
            {/* Separator */}
            <span
              aria-hidden="true"
              className="w-px h-size-4 bg-gold-base opacity-40 mx-space-7 shrink-0"
            />
            <span className="font-body text-[0.82rem] text-text-muted leading-none whitespace-nowrap">
              {item.text}
              {item.year && (
                <span className="font-body text-label-sm uppercase tracking-label-sm text-gold-base ml-space-2 opacity-80">
                  {item.year}
                </span>
              )}
            </span>
          </span>
        ))}
      </div>

      {/* Archive link */}
      {archiveHref && (
        <a
          href={archiveHref}
          className="absolute right-[90px] top-1/2 -translate-y-1/2 z-[3] font-body text-label-sm uppercase tracking-label-sm text-gold-base no-underline bg-surface-base py-space-1 px-space-2"
        >
          {archiveLabel}
        </a>
      )}
    </section>
  );
}
