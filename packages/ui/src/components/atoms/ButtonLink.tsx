"use client";

import { ComponentProps, MouseEvent } from "react";

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

interface ButtonLinkProps extends ComponentProps<"a"> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** When disabled, link becomes non-interactive (aria-disabled, no navigation) */
  disabled?: boolean;
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

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  onClick,
  ref,
  ...rest
}: ButtonLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <a
      ref={ref}
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      data-variant={variant}
      data-size={size}
      data-disabled={disabled ? "" : undefined}
      data-full-width={fullWidth ? "" : undefined}
      data-icon-only={size.startsWith("icon") ? "" : undefined}
      onClick={handleClick}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        !disabled && "cursor-pointer",
        className
      )}
      {...rest}
    >
      <span className="inline-flex items-center gap-space-2">
        {leftIcon && (
          <span className="shrink-0 [&>svg]:size-[1em]">{leftIcon}</span>
        )}
        {children}
        {rightIcon && (
          <span className="shrink-0 [&>svg]:size-[1em]">{rightIcon}</span>
        )}
      </span>
    </a>
  );
}
