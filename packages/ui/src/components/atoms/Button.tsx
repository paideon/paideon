"use client";

import { ComponentProps } from "react";

import { BeatLoader } from "./Spinners/BeatLoader";
import { cn } from "../../utilities/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive"
  | "link";

type ButtonSize =
  | "sm"
  | "md"
  | "lg"
  | "icon-sm"
  | "icon-md"
  | "icon-lg"
  | "icon-xl";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const base = `relative inline-flex items-center justify-center gap-space-2 font-body text-label 
uppercase tracking-label rounded-sm border whitespace-nowrap select-none 
transition-colors transition-transform duration-fast ease-snap motion-reduce:transition-none 
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-base focus-visible:ring-offset-2 
active:scale-[0.98] motion-reduce:active:scale-100`;

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-green-base text-text-inverse border-transparent hover:bg-green-hover active:bg-gold-active",
  secondary:
    "bg-surface-base text-text-primary border-green-base hover:border-gold-hover hover:text-gold-hover active:border-gold-active active:text-gold-active",
  ghost:
    "bg-transparent text-gold-base border-transparent hover:border-gold-hover hover:text-gold-hover active:border-gold-active active:text-gold-active",
  outline:
    "bg-transparent text-gold-base border-gold-base hover:border-gold-hover hover:text-gold-hover active:border-gold-active active:text-gold-active",
  destructive:
    "bg-semantic-error-base text-text-inverse border-transparent hover:bg-semantic-error-base/80 active:bg-semantic-error-base/60",
  link: "bg-transparent text-gold-base border-transparent normal-case tracking-normal underline-offset-4 hover:underline active:text-gold-active",
};

const sizes: Record<ButtonSize, string> = {
  lg: "px-space-5 py-space-4",
  md: "px-space-4 py-space-3",
  sm: "px-space-3 py-space-2",
  "icon-sm": "w-icon-sm h-icon-sm",
  "icon-md": "w-icon-md h-icon-md",
  "icon-lg": "w-icon-lg h-icon-lg",
  "icon-xl": "w-icon-xl h-icon-xl",
};

const loaderSize: Record<ButtonSize, "sm" | "md" | "lg"> = {
  sm: "sm",
  md: "sm",
  lg: "md",
  "icon-sm": "sm",
  "icon-md": "sm",
  "icon-lg": "md",
  "icon-xl": "lg",
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  loadingText,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  onClick,
  ref,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      data-variant={variant}
      data-size={size}
      data-loading={loading ? "" : undefined}
      data-disabled={isDisabled ? "" : undefined}
      data-full-width={fullWidth ? "" : undefined}
      data-icon-only={size.startsWith("icon") ? "" : undefined}
      onClick={handleClick}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        isDisabled && "opacity-40 cursor-not-allowed",
        !isDisabled && "cursor-pointer",
        className
      )}
      {...rest}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center gap-space-2 pointer-events-none">
          <BeatLoader size={loaderSize[size]} />
          {loadingText && (
            <span className="text-label font-body">{loadingText}</span>
          )}
        </span>
      )}

      {loading && (
        <span className="sr-only" aria-live="polite">
          {loadingText ?? "Loading"}
        </span>
      )}

      <span
        className={cn(
          "inline-flex items-center gap-space-2",
          loading && "opacity-0"
        )}
      >
        {leftIcon && (
          <span className="shrink-0 [&>svg]:size-[1em]">{leftIcon}</span>
        )}
        {children}
        {rightIcon && (
          <span className="shrink-0 [&>svg]:size-[1em]">{rightIcon}</span>
        )}
      </span>
    </button>
  );
}
