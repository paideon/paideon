"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, type ElementType } from "react";

import { cn } from "../../utilities/cn";

const checkIsExternal = (href: string): boolean =>
  href.startsWith("http://") ||
  href.startsWith("https://") ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:");

export type AriaCurrentValue =
  | "page"
  | "step"
  | "location"
  | "date"
  | "time"
  | true;

export interface NavLinkProps extends Omit<React.ComponentProps<"a">, "href"> {
  href: string;
  children: ReactNode;
  active?: boolean;
  onDark?: boolean;
  className?: string;
  activeClassName?: string;
  external?: boolean;
  onClick?: () => void;
  prefetch?: boolean;
  ariaCurrent?: AriaCurrentValue;
  as?: ElementType;
}

const baseStyles = [
  "font-body text-label uppercase tracking-label",
  "border-b-2 border-transparent",
  "transition-colors duration-fast ease-snap",
  "focus-visible:ring-2 focus-visible:ring-gold-base focus-visible:ring-offset-2 focus-visible:outline-none",
].join(" ");

const inactiveStyles = {
  light: "text-text-muted hover:text-gold-base",
  dark: "text-text-inverse/55 hover:text-gold-base",
} as const;

const activeStyles = {
  light: "text-gold-base border-gold-base",
  dark: "text-gold-base border-gold-base",
} as const;

export function NavLink({
  href,
  children,
  active,
  onDark = false,
  className,
  activeClassName,
  external,
  onClick,
  prefetch = true,
  ariaCurrent = "page",
  as: Component,
  ref,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname();
  const isExternal = external ?? checkIsExternal(href);

  const isActive =
    active ??
    (href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`));

  const linkClasses = cn(
    baseStyles,
    isActive
      ? activeStyles[onDark ? "dark" : "light"]
      : inactiveStyles[onDark ? "dark" : "light"],
    isActive && activeClassName,
    className // consumer className applied last — always wins via twMerge
  );

  const commonProps = {
    ...rest,
    href,
    className: linkClasses,
    onClick,
    "aria-current": isActive ? ariaCurrent : undefined,
  };

  // Polymorphic — e.g. <NavLink as={motion.a}>
  if (Component) {
    return (
      <Component ref={ref} {...commonProps}>
        {" "}
        {children}
      </Component>
    );
  }

  // External — plain <a> with new-tab warning for screen readers
  if (isExternal) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
        onClick={onClick}
        aria-current={isActive ? ariaCurrent : undefined}
        {...rest}
      >
        {children}
        <span className="sr-only">(opens in new tab)</span>{" "}
      </a>
    );
  }

  // Internal Next.js link
  return (
    <Link
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      prefetch={prefetch}
      className={linkClasses}
      onClick={onClick}
      aria-current={isActive ? ariaCurrent : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}
