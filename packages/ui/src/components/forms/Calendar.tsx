// packages/ui/src/components/feedback/Calendar.tsx
"use client";

import type { EventCardData } from "@paideon/contracts";
import { useState, useCallback } from "react";

import { cn } from "../../utilities/cn";

export type CalendarVariant = "mini-strip" | "month-view" | "list-view";

export interface CalendarProps {
  variant?: CalendarVariant;
  events: EventCardData[];
  month?: string;
  onMonthChange?: (month: string) => void;
  className?: string;
  /** Full month names, January–December. Defaults to English. */
  monthNames?: string[];
  /** Short day abbreviations, Sunday–Saturday. Defaults to English. */
  dayAbbreviations?: string[];
  prevMonthLabel?: string;
  nextMonthLabel?: string;
}

const DEFAULT_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DEFAULT_DAY_ABBREVIATIONS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const statusStyles: Record<
  NonNullable<EventCardData["status"]>,
  { dot: string; badge: string }
> = {
  upcoming: {
    dot: "bg-semantic-info-base",
    badge: "bg-semantic-info-base text-text-inverse",
  },
  today: {
    dot: "bg-gold-base",
    badge: "bg-gold-base text-text-inverse",
  },
  ongoing: {
    dot: "bg-semantic-success-base",
    badge: "bg-semantic-success-base text-text-inverse",
  },
  past: {
    dot: "bg-text-muted",
    badge: "bg-surface-deep text-text-muted",
  },
  "registration-open": {
    dot: "bg-semantic-success-base",
    badge: "bg-semantic-success-base text-text-inverse",
  },
  "registration-closed": {
    dot: "bg-text-muted",
    badge: "bg-surface-deep text-text-muted",
  },
};

export function Calendar({
  variant = "list-view",
  events,
  month,
  onMonthChange,
  className,
  monthNames = DEFAULT_MONTH_NAMES,
  dayAbbreviations = DEFAULT_DAY_ABBREVIATIONS,
  prevMonthLabel = "Previous month",
  nextMonthLabel = "Next month",
}: CalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    month ??
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );

  const changeMonth = useCallback(
    (delta: number) => {
      const [y, m] = currentMonth.split("-").map(Number);
      const d = new Date(y, m - 1 + delta, 1);
      const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      setCurrentMonth(next);
      onMonthChange?.(next);
    },
    [currentMonth, onMonthChange]
  );

  // ---------- Mini Strip ----------
  if (variant === "mini-strip") {
    const upcoming = events.filter((e) => e.status !== "past").slice(0, 5);
    return (
      <div
        className={cn(
          "flex gap-space-3 overflow-x-auto scrollbar-none",
          className
        )}
      >
        {upcoming.map((evt) => {
          const d = new Date(evt.date);
          return (
            <a
              key={evt.id}
              href={evt.href ?? "#"}
              className="group flex-shrink-0 no-underline w-[120px]"
            >
              <div
                className={cn(
                  "bg-surface-elevated border border-border-light overflow-hidden",
                  "transition-all duration-gentle ease-out",
                  "hover:translate-y-[-2px] hover:shadow-elevation-2",
                  "motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                )}
              >
                <div className="bg-green-base text-center py-space-2">
                  <div className="font-display text-[1.6rem] font-medium text-gold-base leading-none">
                    {String(d.getDate()).padStart(2, "0")}
                  </div>
                  <div className="font-body text-[0.58rem] uppercase tracking-[0.15em] text-text-inverse/70 mt-space-0p5">
                    {monthNames[d.getMonth()].slice(0, 3)}
                  </div>
                </div>
                <div className="p-space-2p5">
                  <p
                    className={cn(
                      "font-body text-[0.75rem] text-text-primary leading-tight",
                      "line-clamp-2",
                      "transition-colors duration-fast",
                      "group-hover:text-gold-active"
                    )}
                  >
                    {evt.title}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    );
  }

  // ---------- List View ----------
  if (variant === "list-view") {
    return (
      <div className={cn("flex flex-col gap-px", className)}>
        {events.map((evt) => {
          const d = new Date(evt.date);
          const status = evt.status ?? "upcoming";
          const { dot } = statusStyles[status];

          return (
            <a
              key={evt.id}
              href={evt.href ?? "#"}
              className="group no-underline"
            >
              <div
                className={cn(
                  "flex gap-space-5 items-start p-space-5",
                  "bg-surface-elevated border border-border-light",
                  "transition-all duration-fast",
                  "hover:border-gold-base"
                )}
              >
                <div className="flex-shrink-0 text-center w-11">
                  <div className="font-display text-[1.5rem] font-medium text-gold-base leading-none">
                    {String(d.getDate()).padStart(2, "0")}
                  </div>
                  <div className="font-body text-[0.6rem] uppercase tracking-[0.12em] text-text-muted mt-space-0p5">
                    {monthNames[d.getMonth()].slice(0, 3)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-space-2 mb-space-1">
                    {evt.status && (
                      <span
                        className={cn("w-1.5 h-1.5 rounded-full", dot)}
                        aria-hidden="true"
                      />
                    )}
                    {evt.category && (
                      <span className="font-body text-[0.62rem] uppercase tracking-[0.12em] text-text-muted">
                        {evt.category}
                      </span>
                    )}
                  </div>
                  <h4
                    className={cn(
                      "font-display text-[1.05rem] font-medium text-text-primary mb-space-1",
                      "transition-colors duration-fast",
                      "group-hover:text-gold-active"
                    )}
                  >
                    {evt.title}
                  </h4>
                  {(evt.time || evt.venue) && (
                    <p className="font-body text-[0.78rem] text-text-muted">
                      {[evt.time, evt.venue].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    );
  }

  // ---------- Month View ----------
  const [year, monthNum] = currentMonth.split("-").map(Number);
  const firstDay = new Date(year, monthNum - 1, 1).getDay();
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const eventsByDay: Record<number, EventCardData[]> = {};
  events.forEach((evt) => {
    const d = new Date(evt.date);
    if (d.getFullYear() === year && d.getMonth() + 1 === monthNum) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(evt);
    }
  });

  return (
    <div className={className}>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-space-4">
        <button
          onClick={() => changeMonth(-1)}
          aria-label={prevMonthLabel}
          className={cn(
            "w-8 h-8 flex items-center justify-center",
            "border border-border-default bg-transparent",
            "text-text-muted text-sm",
            "transition-all duration-fast",
            "hover:border-gold-base hover:text-gold-base",
            "focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-[3px]"
          )}
        >
          ←
        </button>
        <h3 className="font-display text-[1.2rem] font-medium text-text-primary">
          {monthNames[monthNum - 1]} {year}
        </h3>
        <button
          onClick={() => changeMonth(1)}
          aria-label={nextMonthLabel}
          className={cn(
            "w-8 h-8 flex items-center justify-center",
            "border border-border-default bg-transparent",
            "text-text-muted text-sm",
            "transition-all duration-fast",
            "hover:border-gold-base hover:text-gold-base",
            "focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-[3px]"
          )}
        >
          →
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-space-1">
        {dayAbbreviations.map((d) => (
          <div
            key={d}
            className="font-body text-[0.62rem] uppercase tracking-[0.1em] text-text-muted text-center py-space-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px">
        {cells.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                className="min-h-[60px] bg-surface-default"
              />
            );
          }
          const isToday =
            day === today.getDate() &&
            year === today.getFullYear() &&
            monthNum === today.getMonth() + 1;
          const isPast =
            new Date(year, monthNum - 1, day) <
            new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const dayEvents = eventsByDay[day] ?? [];

          return (
            <div
              key={day}
              className={cn(
                "min-h-[60px] p-space-1",
                "bg-surface-elevated border",
                isToday ? "border-gold-base" : "border-border-light",
                isPast && "opacity-50"
              )}
            >
              <div
                className={cn(
                  "font-body text-[0.75rem] mb-space-1",
                  isToday ? "text-gold-base font-semibold" : "text-text-muted"
                )}
              >
                {day}
              </div>
              {dayEvents.slice(0, 2).map((evt) => {
                const status = evt.status ?? "upcoming";
                const { badge } = statusStyles[status];
                return (
                  <a
                    key={evt.id}
                    href={evt.href ?? "#"}
                    title={evt.title}
                    className={cn(
                      "block font-body text-[0.58rem] text-text-inverse",
                      "px-space-1 py-space-0p5 mb-space-0p5",
                      "overflow-hidden text-ellipsis whitespace-nowrap",
                      "no-underline",
                      badge
                    )}
                  >
                    {evt.title}
                  </a>
                );
              })}
              {dayEvents.length > 2 && (
                <p className="font-body text-[0.55rem] text-text-muted mt-space-0p5">
                  +{dayEvents.length - 2} more
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Hide scrollbar utility */}
      <style>{`
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
