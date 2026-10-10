import { cn } from '../../utilities/cn';

interface ResultGradeBadgeProps {
  grade: string;
  className?: string;
}

const gradeStyles: Record<string, string> = {
  A: 'bg-semantic-success-base text-text-inverse',
  B: 'bg-semantic-info-base text-text-inverse',
  C: 'bg-semantic-warning-base text-text-inverse',
  S: 'bg-surface-deep text-text-primary',
  W: 'bg-semantic-error-base text-text-inverse',
  F: 'bg-semantic-error-base text-text-inverse',
};

export function ResultsGradeBadge({ grade, className }: ResultGradeBadgeProps) {
  const normalized = grade.toUpperCase();
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-size-8 h-size-8 rounded-full font-body text-sm font-semibold capitalise',
        gradeStyles[normalized] || 'bg-surface-default text-text-muted',
        className,
      )}
    >
      {normalized}
    </span>
  );
}
