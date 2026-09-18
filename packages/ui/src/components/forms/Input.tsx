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
  type?:
    | "text"
    | "email"
    | "tel"
    | "password"
    | "number"
    | "search"
    | "url"
    | "date"
    | "time"
    | "datetime-local";
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  name?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
};

const inputBase = `w-full font-body text-body text-text-primary bg-surface-elevated 
border rounded-sm px-space-4 py-space-3 
transition-all duration-fast ease-snap 
placeholder:text-text-muted 
disabled:bg-surface-deep disabled:text-text-muted disabled:cursor-not-allowed 
focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-[3px]`;

export function Input({
  label,
  helperText,
  error,
  disabled = false,
  required = false,
  placeholder,
  type = "text",
  value,
  defaultValue,
  onChange,
  onBlur,
  name,
  autoComplete,
  inputMode,
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
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={cn(
          inputBase,
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
