"use client";

import { useId } from "react";

import { cn } from "../../utilities/cn";

type Props = {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  value: string;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
};

export function Radio({
  label,
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

  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex items-center gap-space-3 cursor-pointer select-none",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      <input
        ref={ref}
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        className={cn(
          "appearance-none w-4 h-4 rounded-full border border-border-default bg-surface-elevated shrink-0",
          "transition-all duration-fast ease-snap",
          "checked:border-green-base checked:bg-green-base",
          "checked:bg-[url(/icons/radio-dot.svg)] checked:bg-center checked:bg-no-repeat",
          "focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-[3px]"
        )}
      />
      <span className="font-body text-body text-text-primary">{label}</span>
    </label>
  );
}
