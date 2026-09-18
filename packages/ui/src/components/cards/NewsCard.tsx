import type { ArticleCardData, NewsCardVariantType } from "@paideon/contracts";
import Image from "next/image";
import Link from "next/link";

import { cn } from "../../utilities/cn";
import { Badge } from "../atoms/Badge";

export interface NewsCardProps extends Omit<ArticleCardData, "variant"> {
  variant?: NewsCardVariantType;
  className?: string;
  readMoreLabel?: string;
}

// Featured variant
function NewsCardFeatured({
  title,
  excerpt,
  category,
  date,
  href,
  imageSrc,
  imageAlt,
  readMoreLabel = "Read more →",
}: NewsCardProps) {
  return (
    <Link href={href} className="group block no-underline">
      <div
        className={cn(
          "bg-surface-elevated border border-border-light overflow-hidden",
          "shadow-elevation-1 transition-all duration-gentle",
          "group-hover:shadow-elevation-3 group-hover:-translate-y-0.5"
        )}
      >
        <div className="relative aspect-[16/7] overflow-hidden bg-green-base">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt ?? title}
              fill
              className="object-cover transition-transform duration-gentle group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-base to-green-hover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-overlay-medium to-transparent" />
          <div className="absolute top-space-5 left-space-5">
            <Badge variant="category" label={category} />
          </div>
        </div>
        <div className="p-space-7 md:p-space-8">
          <div className="flex items-center gap-space-4 mb-space-4 font-body text-caption uppercase tracking-caption text-text-muted">
            <span>{date}</span>
          </div>
          <h3
            className={cn(
              "font-display text-[clamp(1.5rem,2.5vw,2rem)] font-medium text-text-primary mb-space-3",
              "transition-colors duration-fast group-hover:text-gold-active"
            )}
          >
            {title}
          </h3>
          {excerpt && (
            <p className="font-body text-body text-text-muted leading-relaxed mb-space-5">
              {excerpt}
            </p>
          )}
          <span className="font-body text-caption uppercase tracking-caption text-gold-base">
            {readMoreLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

// Standard variant
function NewsCardStandard({
  title,
  excerpt,
  category,
  date,
  href,
  imageSrc,
  imageAlt,
  readMoreLabel = "Read more →",
}: NewsCardProps) {
  return (
    <Link href={href} className="group block no-underline h-full">
      <div
        className={cn(
          "flex flex-col h-full bg-surface-elevated border border-border-light overflow-hidden",
          "shadow-elevation-1 transition-all duration-gentle",
          "group-hover:shadow-elevation-3 group-hover:-translate-y-0.5"
        )}
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-green-base flex-shrink-0">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt ?? title}
              fill
              className="object-cover transition-transform duration-gentle group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-base to-green-hover" />
          )}
          <div className="absolute top-space-3 left-space-3">
            <Badge variant="category" label={category} />
          </div>
        </div>
        <div className="p-space-5 flex flex-col flex-1">
          <p className="font-body text-caption uppercase tracking-caption text-text-muted mb-space-2.5">
            {date}
          </p>
          <h3
            className={cn(
              "font-display text-h3 font-medium text-text-primary mb-space-2.5",
              "transition-colors duration-fast group-hover:text-gold-active"
            )}
          >
            {title}
          </h3>
          {excerpt && (
            <p className="font-body text-body-sm text-text-muted leading-relaxed line-clamp-3 mb-space-4 flex-1">
              {excerpt}
            </p>
          )}
          <span className="font-body text-caption uppercase tracking-caption text-gold-base mt-auto">
            {readMoreLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

// Compact variant
function NewsCardCompact({
  title,
  category,
  date,
  href,
  imageSrc,
  imageAlt,
}: NewsCardProps) {
  return (
    <Link href={href} className="group block no-underline">
      <div className="flex gap-space-4 py-space-3.5 border-b border-border-light transition-opacity duration-fast group-hover:opacity-80">
        <div className="relative w-[72px] h-14 flex-shrink-0 overflow-hidden bg-green-base">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt ?? title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-base to-green-hover" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-space-2 mb-space-2 font-body text-caption uppercase tracking-caption text-text-muted">
            <span className="text-gold-base">{category}</span>
            <span>·</span>
            <span>{date}</span>
          </div>
          <h4
            className={cn(
              "font-body text-body-sm font-medium text-text-primary line-clamp-2",
              "transition-colors duration-fast group-hover:text-gold-active"
            )}
          >
            {title}
          </h4>
        </div>
      </div>
    </Link>
  );
}

export function NewsCard({ variant = "standard", ...props }: NewsCardProps) {
  if (variant === "featured") return <NewsCardFeatured {...props} />;
  if (variant === "compact") return <NewsCardCompact {...props} />;
  return <NewsCardStandard {...props} />;
}
