"use client";

import { ElementType } from "react";

import { cn } from "../../utilities/cn";

type BadgeStatus =
  | "draft"
  | "review"
  | "published"
  | "archived"
  | "unread"
  | "reviewed";
type BadgeVariant = "category" | "status" | "achievement";

// Discriminated union for better type safety
type BadgeProps =
  | {
      variant: "category" | "achievement";
      label: string;
      className?: string;
      as?: ElementType;
      ref?: React.Ref<HTMLElement>;
    }
  | {
      variant: "status";
      status: BadgeStatus;
      className?: string;
      as?: ElementType;
      ref?: React.Ref<HTMLElement>;
    };

const variantStyles: Record<Exclude<BadgeVariant, "status">, string> = {
  category: "bg-surface-default text-text-muted",
  achievement: "bg-gold-pale text-gold-active",
};

const statusStyles: Record<BadgeStatus, string> = {
  draft: "bg-semantic-warning-surface text-semantic-warning-base",
  review: "bg-semantic-info-surface text-semantic-info-base",
  published: "bg-semantic-success-surface text-semantic-success-base",
  archived: "bg-surface-default text-text-muted",
  unread: "bg-semantic-info-surface text-semantic-info-base",
  reviewed: "bg-semantic-success-surface text-semantic-success-base",
};

const statusLabels: Record<BadgeStatus, string> = {
  draft: "Draft",
  review: "In Review",
  published: "Published",
  archived: "Archived",
  unread: "Unread",
  reviewed: "Reviewed",
};

const base = `inline-flex items-center px-space-2 py-space-1 rounded-full font-body text-caption 
uppercase tracking-caption leading-none select-none whitespace-nowrap`;

export function Badge(props: BadgeProps) {
  const { variant, className, as: Tag = "span", ref } = props;

  let colorClass = "";
  let label = "";
  let ariaLabel: string | undefined;

  if (variant === "status") {
    colorClass = statusStyles[props.status];
    label = statusLabels[props.status];
    ariaLabel = `Status: ${label}`;
  } else {
    colorClass = variantStyles[variant];
    label = props.label;
  }

  return (
    <Tag
      ref={ref}
      aria-label={ariaLabel}
      data-variant={variant}
      data-status={variant === "status" ? props.status : undefined}
      className={cn(base, colorClass, className)}
    >
      {label}
    </Tag>
  );
}
