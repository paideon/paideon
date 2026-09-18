import { cn } from "../../utilities/cn";

export interface ProgressStep {
  id: string;
  label: string;
}

export type ProgressIndicatorVariant = "steps" | "bar";

export interface ProgressIndicatorProps {
  variant?: ProgressIndicatorVariant;
  steps?: ProgressStep[];
  activeStep?: number;
  value?: number;
  label?: string;
  showPercentage?: boolean;
  /** aria-label for the steps nav (steps variant) */
  stepsAriaLabel?: string;
  /** Fallback aria-label for the bar variant when no `label` is given */
  barAriaLabel?: string;
}

export function ProgressIndicator({
  variant = "steps",
  steps = [],
  activeStep = 0,
  value = 0,
  label,
  showPercentage = true,
  stepsAriaLabel = "Progress steps",
  barAriaLabel = "Progress",
}: ProgressIndicatorProps) {
  if (variant === "bar") {
    const pct = Math.max(0, Math.min(100, value));
    return (
      <div>
        {(label || showPercentage) && (
          <div className="flex justify-between items-baseline mb-space-2">
            {label && (
              <span className="font-body text-caption uppercase tracking-caption text-text-muted">
                {label}
              </span>
            )}
            {showPercentage && (
              <span className="font-body text-caption uppercase tracking-caption text-gold-base">
                {pct}%
              </span>
            )}
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label ?? barAriaLabel}
          className="h-1 bg-border-light rounded-sm overflow-hidden"
        >
          <div
            className="h-full bg-green-base rounded-sm transition-all duration-gentle"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <nav aria-label={stepsAriaLabel}>
      <ol className="flex items-start gap-0 list-none p-0 m-0">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;
          const isLast = idx === steps.length - 1;

          return (
            <li
              key={step.id}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                isLast ? "flex-none" : "flex-1",
                "flex items-center"
              )}
            >
              <div className="flex flex-col items-center gap-space-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "font-body text-sm font-semibold transition-all duration-fast",
                    isCompleted
                      ? "bg-green-base text-text-inverse border-2 border-green-base"
                      : isActive
                      ? "bg-transparent text-gold-base border-2 border-gold-base"
                      : "bg-transparent text-text-muted border-2 border-border-default"
                  )}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <span
                  className={cn(
                    "font-body text-caption uppercase tracking-caption text-center whitespace-nowrap",
                    isCompleted
                      ? "text-green-base"
                      : isActive
                      ? "text-gold-base"
                      : "text-text-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "flex-1 h-0.5 mb-[26px] min-w-space-6 transition-colors duration-gentle",
                    isCompleted ? "bg-green-base" : "bg-border-light"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
