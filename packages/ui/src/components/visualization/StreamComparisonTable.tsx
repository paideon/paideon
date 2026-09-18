// packages/ui/src/components/visualization/StreamComparisonTable.tsx
"use client";

import type { StreamComparisonData } from "@paideon/contracts";

import { cn } from "../../utilities/cn";

export interface StreamComparisonTableLabels {
  stream1?: string;
  stream2?: string;
  sharedSubjects?: string;
  differences?: string;
  recommendedFor?: string;
  inStream?: string;
  notInStream?: string;
}

export interface StreamComparisonTableProps {
  streams: StreamComparisonData[];
  className?: string;
  labels?: StreamComparisonTableLabels;
}

const DEFAULT_LABELS: Required<StreamComparisonTableLabels> = {
  stream1: "Stream 1",
  stream2: "Stream 2",
  sharedSubjects: "Shared Subjects",
  differences: "Subject Differences",
  recommendedFor: "Recommended For",
  inStream: "✓",
  notInStream: "–",
};

export function StreamComparisonTable({
  streams,
  className,
  labels,
}: StreamComparisonTableProps) {
  const l = { ...DEFAULT_LABELS, ...labels };

  return (
    <div className={cn("flex flex-col gap-space-8", className)}>
      {streams.map((comparison, idx) => (
        <div
          key={idx}
          className="bg-surface-elevated border border-border-light rounded-lg overflow-hidden"
        >
          {/* Header: stream names */}
          <div className="grid grid-cols-3 border-b border-border-light">
            <div className="p-space-4 bg-surface-deep" />
            <div className="p-space-4 border-l border-border-light">
              <h3 className="font-display text-h3 text-gold-base">
                {comparison.stream1}
              </h3>
            </div>
            <div className="p-space-4 border-l border-border-light">
              <h3 className="font-display text-h3 text-gold-base">
                {comparison.stream2}
              </h3>
            </div>
          </div>

          {/* Shared Subjects */}
          {comparison.subjectOverlap.length > 0 && (
            <div className="grid grid-cols-3 border-b border-border-light">
              <div className="p-space-4 bg-surface-deep font-body text-label uppercase tracking-wider text-text-muted flex items-center">
                {l.sharedSubjects}
              </div>
              <div className="col-span-2 p-space-4 border-l border-border-light">
                <ul className="flex flex-wrap gap-space-2">
                  {comparison.subjectOverlap.map((subject) => (
                    <li
                      key={subject}
                      className="px-space-3 py-space-1 rounded-full bg-border-light font-body text-body-sm text-text-primary"
                    >
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Subject Differences */}
          {comparison.subjectDifferences.length > 0 && (
            <div className="border-b border-border-light">
              <div className="grid grid-cols-3 border-b border-border-light bg-surface-deep">
                <div className="p-space-3 font-body text-label uppercase tracking-wider text-text-muted">
                  {l.differences}
                </div>
                <div className="p-space-3 border-l border-border-light font-body text-label text-text-muted text-center">
                  {comparison.stream1}
                </div>
                <div className="p-space-3 border-l border-border-light font-body text-label text-text-muted text-center">
                  {comparison.stream2}
                </div>
              </div>
              {comparison.subjectDifferences.map((diff) => (
                <div
                  key={diff.subject}
                  className="grid grid-cols-3 border-t border-border-light"
                >
                  <div className="p-space-3 font-body text-body-sm text-text-primary">
                    {diff.subject}
                  </div>
                  <div className="p-space-3 border-l border-border-light text-center font-body text-body-sm">
                    <span
                      className={
                        diff.inStream1
                          ? "text-green-base font-semibold"
                          : "text-text-muted"
                      }
                    >
                      {diff.inStream1 ? l.inStream : l.notInStream}
                    </span>
                  </div>
                  <div className="p-space-3 border-l border-border-light text-center font-body text-body-sm">
                    <span
                      className={
                        diff.inStream2
                          ? "text-green-base font-semibold"
                          : "text-text-muted"
                      }
                    >
                      {diff.inStream2 ? l.inStream : l.notInStream}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommended For */}
          {comparison.recommendedFor && (
            <div className="grid grid-cols-3">
              <div className="p-space-4 bg-surface-deep font-body text-label uppercase tracking-wider text-text-muted flex items-center">
                {l.recommendedFor}
              </div>
              <div className="col-span-2 p-space-4 border-l border-border-light font-body text-body-sm text-text-primary italic">
                {comparison.recommendedFor}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
