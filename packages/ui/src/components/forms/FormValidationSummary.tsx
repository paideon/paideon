import { cn } from "../../utilities/cn";

export interface FormValidationSummaryProps {
  errors?: string[] | null;
  successMessage?: string | null;
  /** Summary line builder, receives the error count */
  getSummaryLabel?: (count: number) => string;
}

export function FormValidationSummary({
  errors,
  successMessage,
  getSummaryLabel = (count) =>
    `Please fix ${count} ${count === 1 ? "error" : "errors"} before continuing`,
}: FormValidationSummaryProps) {
  if (successMessage) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-start gap-space-3 p-space-5",
          "bg-semantic-success-surface border border-semantic-success-base",
          "border-l-[3px] border-l-semantic-success-base"
        )}
      >
        <span
          aria-hidden="true"
          className="text-semantic-success-base text-base leading-none mt-0.5"
        >
          ✓
        </span>
        <p className="font-body text-body-sm text-semantic-success-base leading-relaxed">
          {successMessage}
        </p>
      </div>
    );
  }

  if (!errors || errors.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "p-space-5",
        "bg-semantic-error-surface border border-semantic-error-base",
        "border-l-[3px] border-l-semantic-error-base"
      )}
    >
      <p className="font-body text-caption uppercase tracking-caption text-semantic-error-base mb-space-2.5">
        {getSummaryLabel(errors.length)}
      </p>
      <ul className="list-none p-0 m-0 flex flex-col gap-space-1.5">
        {errors.map((error) => (
          <li
            key={error}
            className="flex items-baseline gap-space-2 font-body text-body-sm text-semantic-error-base"
          >
            <span aria-hidden="true" className="text-xs flex-shrink-0">
              ●
            </span>
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}
