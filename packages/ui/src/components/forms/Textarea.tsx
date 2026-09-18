"use client";

import { useFormField } from "../../hooks/useFormField";
import { cn } from "../../utilities/cn";

type Props = {
  label: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  name?: string;
  className?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
};

const textareaBase = `w-full font-body text-body text-text-primary bg-surface-elevated 
border rounded-sm px-space-4 py-space-3 
transition-all duration-fast ease-snap 
placeholder:text-text-muted resize-y min-h-[120px] 
disabled:bg-surface-deep disabled:text-text-muted disabled:cursor-not-allowed 
focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-[3px]`;

export function Textarea({
  label,
  helperText,
  error,
  disabled = false,
  required = false,
  placeholder,
  rows = 4,
  value,
  defaultValue,
  onChange,
  onBlur,
  name,
  className,
  ref,
}: Props) {
  const { id, errorId, helperId, hasError, describedBy } = useFormField({
    error,
    helperText,
  });

  return (
    <div className={cn("flex flex-col gap-space-2", className)}>
      <label
        htmlFor={id}
        className="font-body text-label text-text-primary uppercase tracking-label"
      >
        {label}
        {required && (
          <span
            className="ml-space-1 text-semantic-error-base"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>
      <textarea
        ref={ref}
        id={id}
        name={name}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={cn(
          textareaBase,
          hasError
            ? "border-semantic-error-base focus-visible:border-semantic-error-base focus-visible:outline-semantic-error-base"
            : "border-border-default hover:border-border-default focus-visible:border-gold-base"
        )}
      />
      {hasError && (
        <p
          id={errorId}
          className="font-body text-caption text-semantic-error-base"
          role="alert"
        >
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p id={helperId} className="font-body text-caption text-text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}
