"use client";

import type { AchievementCardData } from "@paideon/contracts";
import Image from "next/image";
import Link from "next/link";

import { cn } from "../../utilities/cn";
import { Badge } from "../atoms/Badge";

type AchievementCardVariant = "ticker-item" | "archive-post";

interface AchievementCardProps extends Omit<AchievementCardData, "id"> {
  id?: string;
  variant?: AchievementCardVariant;
  className?: string;
}

export function AchievementCard({
  variant = "archive-post",
  studentName,
  title,
  year,
  category,
  context,
  imageSrc,
  imageAlt,
  href,
  className,
}: AchievementCardProps) {
  if (variant === "ticker-item") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-space-3 px-space-5 py-space-2",
          "bg-surface-elevated border border-border-light",
          "whitespace-nowrap flex-shrink-0",
          className
        )}
      >
        <span className="font-body text-body-sm text-text-primary">
          {studentName} — {title}
        </span>
        {category && <Badge variant="category" label={category} />}
        <span className="font-body text-caption uppercase tracking-caption text-gold-base">
          {year}
        </span>
      </div>
    );
  }

  const content = (
    <div
      className={cn(
        "bg-surface-elevated border border-border-light overflow-hidden",
        "shadow-elevation-1 transition-all duration-gentle ease-out",
        "group-hover:shadow-elevation-3 group-hover:-translate-y-0.5",
        className
      )}
    >
      {imageSrc && (
        <div className="relative aspect-[16/9] overflow-hidden bg-green-base">
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            className="object-cover transition-transform duration-gentle group-hover:scale-[1.04]"
          />
        </div>
      )}
      <div className="p-space-6">
        <div className="flex items-center gap-space-2.5 mb-space-3">
          <span className="font-body text-caption uppercase tracking-caption text-gold-base">
            {year}
          </span>
          {category && <Badge variant="category" label={category} />}
        </div>
        <h3
          className={cn(
            "font-display text-h3 font-medium text-text-primary mb-space-1",
            "transition-colors duration-fast group-hover:text-gold-active"
          )}
        >
          {title}
        </h3>
        <p className="font-body text-body-sm text-gold-base font-medium mb-space-2.5">
          {studentName}
        </p>
        {context && (
          <p className="font-body text-body-sm text-text-muted leading-relaxed">
            {context}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block no-underline">
        {content}
      </Link>
    );
  }

  return <div className="group block">{content}</div>;
}
