// packages/ui/src/components/visualization/TimetableGrid.tsx
"use client";
import { cn } from "../../utilities/cn";
export interface TimetableEntryData {
  period: string;
  time: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
}

export interface TimetableGridProps {
  entries: TimetableEntryData[];
  className?: string;
  periodTimeLabel?: string;
  /** Day names shown as column headers, Monday–Saturday. Defaults to English. */
  days?: string[];
}

const DEFAULT_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function TimetableGrid({
  entries,
  className,
  periodTimeLabel = "Period / Time",
  days = DEFAULT_DAYS,
}: TimetableGridProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-surface-deep border-b border-border-default">
            <th className="p-space-3 text-left font-body text-label uppercase tracking-wider text-text-muted">
              {periodTimeLabel}
            </th>
            {days.map((day) => (
              <th
                key={day}
                className="p-space-3 text-left font-body text-label uppercase tracking-wider text-text-muted"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr
              key={entry.period}
              className={cn(
                "border-b border-border-light",
                idx % 2 === 0 && "bg-surface-default/50"
              )}
            >
              <td className="p-space-3 font-body text-body-sm text-text-primary whitespace-nowrap">
                <div>{entry.period}</div>
                <div className="font-body text-caption text-text-muted">
                  {entry.time}
                </div>
              </td>
              <td className="p-space-3 font-body text-body-sm text-text-primary">
                {entry.monday || "—"}
              </td>
              <td className="p-space-3 font-body text-body-sm text-text-primary">
                {entry.tuesday || "—"}
              </td>
              <td className="p-space-3 font-body text-body-sm text-text-primary">
                {entry.wednesday || "—"}
              </td>
              <td className="p-space-3 font-body text-body-sm text-text-primary">
                {entry.thursday || "—"}
              </td>
              <td className="p-space-3 font-body text-body-sm text-text-primary">
                {entry.friday || "—"}
              </td>
              <td className="p-space-3 font-body text-body-sm text-text-primary">
                {entry.saturday || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
