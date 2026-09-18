"use client";

import type {
  EventCardData,
  EventStatusType,
  EventCardVariantType,
} from "@paideon/contracts";
import Image from "next/image";
import Link from "next/link";

import { cn } from "../../utilities/cn";
import { Badge } from "../atoms/Badge";

export interface EventCardProps extends Omit<EventCardData, "id" | "variant"> {
  variant?: EventCardVariantType;
  className?: string;
  /** Only used by the featured variant */
  viewDetailsLabel?: string;
  registerLabel?: string;
  /** Overrides for the status badge text (defaults to English) */
  statusLabels?: Partial<Record<EventStatusType, string>>;
}

const DEFAULT_STATUS_LABELS: Record<EventStatusType, string> = {
  upcoming: "Upcoming",
  today: "Today",
  ongoing: "Happening Now",
  past: "Past",
  "registration-open": "Registration Open",
  "registration-closed": "Registration Closed",
};

const STATUS_CONFIG: Record<
  EventStatusType,
  { bg: string; text: string; dot?: string }
> = {
  upcoming: {
    bg: "bg-semantic-info-surface",
    text: "text-semantic-info-base",
  },
  today: {
    bg: "bg-gold-pale",
    text: "text-gold-active",
  },
  ongoing: {
    bg: "bg-semantic-success-surface",
    text: "text-semantic-success-base",
    dot: "bg-semantic-success-base",
  },
  past: {
    bg: "bg-surface-deep",
    text: "text-text-muted",
  },
  "registration-open": {
    bg: "bg-semantic-success-surface",
    text: "text-semantic-success-base",
  },
  "registration-closed": {
    bg: "bg-surface-deep",
    text: "text-text-muted",
  },
};

function EventStatusBadge({
  status,
  statusLabels,
}: {
  status: EventStatusType;
  statusLabels?: Partial<Record<EventStatusType, string>>;
}) {
  const config = STATUS_CONFIG[status];
  const label = statusLabels?.[status] ?? DEFAULT_STATUS_LABELS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-space-1 px-space-2.5 py-space-1 rounded-full",
        "font-body text-caption uppercase tracking-caption",
        config.bg,
        config.text
      )}
    >
      {config.dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full", config.dot)}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}

function DateBlock({ date, isPast }: { date: string; isPast?: boolean }) {
  let day = date;
  let month = "";
  try {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      day = d.getDate().toString();
      month = d.toLocaleString("default", { month: "short" }).toUpperCase();
    }
  } catch {
    // keep as is
  }
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-w-[56px] px-space-3 py-space-2.5",
        isPast ? "bg-surface-deep" : "bg-green-base"
      )}
    >
      <span
        className={cn(
          "font-display text-[1.75rem] font-medium leading-none",
          isPast ? "text-text-muted" : "text-gold-base"
        )}
      >
        {day}
      </span>
      {month && (
        <span
          className={cn(
            "font-body text-[0.55rem] uppercase tracking-[0.15em] mt-space-0.5",
            isPast ? "text-text-muted" : "text-text-inverse/60"
          )}
        >
          {month}
        </span>
      )}
    </div>
  );
}

// Standard variant
function EventCardStandard({
  title,
  description,
  date,
  time,
  venue,
  category,
  status = "upcoming",
  href,
  imageSrc,
  imageAlt,
  relativeTime,
  statusLabels,
}: EventCardProps) {
  const isPast = status === "past";
  return (
    <Link href={href} className="group block no-underline">
      <div
        className={cn(
          "bg-surface-elevated border border-border-light overflow-hidden",
          "shadow-elevation-1 transition-all duration-gentle",
          "group-hover:shadow-elevation-3 group-hover:-translate-y-0.5",
          isPast && "opacity-70"
        )}
      >
        {imageSrc && (
          <div className="relative aspect-[16/7] overflow-hidden bg-green-base">
            <Image
              src={imageSrc}
              alt={imageAlt ?? title}
              fill
              className={cn(
                "object-cover transition-transform duration-gentle group-hover:scale-[1.03]",
                isPast && "grayscale-[0.4] saturate-[0.7]"
              )}
            />
          </div>
        )}
        <div className="p-space-5 flex gap-space-4">
          <DateBlock date={date} isPast={isPast} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-space-2 mb-space-3">
              <EventStatusBadge status={status} statusLabels={statusLabels} />
              {category && <Badge variant="category" label={category} />}
            </div>
            <h3
              className={cn(
                "font-display text-h3 font-medium text-text-primary mb-space-2",
                "transition-colors duration-fast group-hover:text-gold-active"
              )}
            >
              {title}
            </h3>
            {description && (
              <p className="font-body text-body-sm text-text-muted line-clamp-2 mb-space-2.5">
                {description}
              </p>
            )}
            <div className="flex flex-wrap gap-space-4 font-body text-caption uppercase tracking-caption text-text-muted">
              {time && <span> {time}</span>}
              {venue && <span> {venue}</span>}
              {relativeTime && (
                <span className="text-gold-base">{relativeTime}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Compact variant
function EventCardCompact({
  title,
  date,
  time,
  venue,
  status = "upcoming",
  href,
  relativeTime,
  statusLabels,
}: EventCardProps) {
  const isPast = status === "past";
  return (
    <Link
      href={href}
      className="group flex gap-space-3 items-start no-underline"
    >
      <DateBlock date={date} isPast={isPast} />
      <div className="flex-1 pb-space-3.5 border-b border-border-light">
        {status !== "past" && (
          <div className="mb-space-2">
            <EventStatusBadge status={status} statusLabels={statusLabels} />
          </div>
        )}
        <p
          className={cn(
            "font-body font-medium text-text-primary mb-space-1.5",
            "transition-colors duration-fast group-hover:text-gold-active"
          )}
        >
          {title}
        </p>
        <div className="flex flex-wrap gap-space-2.5 font-body text-caption uppercase tracking-caption text-text-muted">
          {time && <span>{time}</span>}
          {venue && <span>{venue}</span>}
          {relativeTime && (
            <span className="text-gold-base">{relativeTime}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Featured variant
function EventCardFeatured({
  title,
  description,
  date,
  time,
  venue,
  category,
  status = "upcoming",
  href,
  imageSrc,
  imageAlt,
  relativeTime,
  registrationHref,
  viewDetailsLabel = "View Details",
  registerLabel = "Register",
  statusLabels,
}: EventCardProps) {
  const isPast = status === "past";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-surface-elevated border border-border-light overflow-hidden">
      <div className="relative min-h-[360px] bg-green-base">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            className={cn(
              "object-cover",
              isPast && "grayscale-[0.4] saturate-[0.7]"
            )}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-base to-green-hover flex items-center justify-center">
            <span className="font-display text-6xl text-gold-base/40">
              {date.split("-")[2] ?? date}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-overlay-light" />
      </div>
      <div className="p-space-10 md:p-space-11 flex flex-col justify-center gap-space-5">
        <div className="flex flex-wrap items-center gap-space-2">
          <EventStatusBadge status={status} statusLabels={statusLabels} />
          {category && <Badge variant="category" label={category} />}
        </div>
        <div className="flex items-start gap-space-4">
          <DateBlock date={date} isPast={isPast} />
          <div>
            {time && (
              <p className="font-body text-caption uppercase tracking-caption text-text-muted mb-space-1">
                {time}
              </p>
            )}
            {relativeTime && (
              <p className="font-body text-body-sm text-gold-base font-medium">
                {relativeTime}
              </p>
            )}
          </div>
        </div>
        <div>
          <h2 className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-medium text-text-primary mb-space-3">
            {title}
          </h2>
          {description && (
            <p className="font-body text-body text-text-muted leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {venue && (
          <p className="font-body text-caption uppercase tracking-caption text-text-muted">
            {" "}
            {venue}
          </p>
        )}
        <div className="flex flex-wrap gap-space-3">
          <Link
            href={href}
            className="inline-block px-space-6 py-space-2.5 bg-green-base text-text-inverse font-body text-caption uppercase tracking-caption"
          >
            {viewDetailsLabel}
          </Link>
          {registrationHref && status === "registration-open" && (
            <Link
              href={registrationHref}
              className="inline-block px-space-6 py-space-2.5 border border-gold-base text-gold-base font-body text-caption uppercase tracking-caption hover:bg-gold-base hover:text-green-base transition-colors"
            >
              {registerLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function EventCard({ variant = "standard", ...props }: EventCardProps) {
  if (variant === "featured") return <EventCardFeatured {...props} />;
  if (variant === "compact") return <EventCardCompact {...props} />;
  return <EventCardStandard {...props} />;
}
