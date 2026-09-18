"use client";

import { useId, type ChangeEventHandler } from "react";

import { cn } from "../../utilities/cn";

type Props = {
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  value?: string;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
};

export function Checkbox({
  label,
  description,
  checked,
  defaultChecked,
  disabled = false,
  onChange,
  name,
  value,
  className,
  ref,
}: Props) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;

  const controlledProps =
    checked !== undefined ? { checked } : { defaultChecked };

  return (
    <label
      htmlFor={id}
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "group inline-flex items-start gap-space-3 cursor-pointer select-none",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        aria-describedby={descriptionId}
        {...controlledProps}
        className="sr-only peer"
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative mt-0.5 flex shrink-0 items-center justify-center",
          "w-4 h-4 rounded-sm border border-border-default bg-surface-elevated",
          "transition-all duration-fast ease-snap",
          "peer-checked:bg-green-base peer-checked:border-green-base",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-gold-base peer-focus-visible:outline-offset-[3px]"
        )}
      >
        <svg
          viewBox="0 0 10 8"
          fill="none"
          className={cn(
            "w-2.5 h-2 text-white",
            "scale-0 opacity-0 transition-all duration-fast ease-snap",
            "peer-checked:scale-100 peer-checked:opacity-100"
          )}
          aria-hidden="true"
        >
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col gap-space-1">
        <span className="font-body text-body text-text-primary">{label}</span>
        {description && (
          <span
            id={descriptionId}
            className="font-body text-caption text-text-muted"
          >
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
