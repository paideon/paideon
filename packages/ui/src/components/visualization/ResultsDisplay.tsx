// packages/ui/src/components/visualization/ResultsDisplay.tsx
"use client";
import { cn } from "../../utilities/cn";
import { ButtonLink } from "../atoms/ButtonLink";
import { ResultsGradeBadge } from "../atoms/ResultsGradeBadge";

export interface SubjectResultData {
  name: string;
  grade: string;
}

export interface ResultsDisplayProps {
  studentName: string;
  indexNumber: string;
  examType: "OL" | "AL" | "SCHOLARSHIP";
  year: number;
  subjects: SubjectResultData[];
  pdfUrl?: string;
  className?: string;
  indexNumberLabel?: string;
  subjectLabel?: string;
  gradeLabel?: string;
  downloadLabel?: string;
}

export function ResultsDisplay({
  studentName,
  indexNumber,
  examType,
  year,
  subjects,
  pdfUrl,
  className,
  indexNumberLabel = "Index No:",
  subjectLabel = "Subject",
  gradeLabel = "Grade",
  downloadLabel = "Download Official Result Sheet (PDF)",
}: ResultsDisplayProps) {
  return (
    <div
      className={cn(
        "bg-surface-elevated border border-border-light rounded-lg p-space-6 shadow-elevation-0",
        className
      )}
    >
      <div className="flex justify-between items-start mb-space-6 pb-space-4 border-b border-border-light">
        <div>
          <h2 className="font-display text-h3 text-text-primary">
            {studentName}
          </h2>
          <p className="font-body text-body-sm text-text-muted mt-space-1">
            {indexNumberLabel} {indexNumber} • {examType} {year}
          </p>
        </div>
        <div className="w-16 h-16 opacity-30">
          <svg viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="var(--color-gold-base)"
              strokeWidth="1.5"
            />
            <path
              d="M50 25 L55 40 L70 40 L58 50 L62 65 L50 56 L38 65 L42 50 L30 40 L45 40 Z"
              fill="var(--color-gold-base)"
            />
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto mb-space-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-light">
              <th className="text-left py-space-3 font-body text-label uppercase tracking-wider text-text-muted">
                {subjectLabel}
              </th>
              <th className="text-right py-space-3 font-body text-label uppercase tracking-wider text-text-muted">
                {gradeLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.name} className="border-b border-border-light">
                <td className="py-space-3 font-body text-body text-text-primary">
                  {subject.name}
                </td>
                <td className="py-space-3 text-right">
                  <ResultsGradeBadge grade={subject.grade} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pdfUrl && (
        <div className="flex justify-center">
          <ButtonLink href={pdfUrl} variant="secondary" size="sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mr-space-2"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            {downloadLabel}
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
