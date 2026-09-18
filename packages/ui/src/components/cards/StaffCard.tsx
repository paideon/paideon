import type { StaffCardData, StaffCardVariantType } from "@paideon/contracts";
import Image from "next/image";
import Link from "next/link";

export interface StaffCardProps extends Omit<StaffCardData, "variant"> {
  variant?: StaffCardVariantType;
  className?: string;
  /** Only used by the principal variant */
  readMoreLabel?: string;
}

// Principal variant
function StaffCardPrincipal({
  name,
  title,
  tenure,
  quote,
  imageSrc,
  imageAlt,
  href,
  readMoreLabel = "Read Full Message →",
}: StaffCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 bg-surface-elevated border border-border-light overflow-hidden">
      <div className="md:col-span-4 relative min-h-[420px] bg-green-base">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? name}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-base to-green-hover flex items-center justify-center">
            <span className="font-display text-7xl italic text-gold-base/25">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-overlay-medium to-transparent" />
      </div>
      <div className="md:col-span-8 p-space-11 flex flex-col justify-center gap-space-5">
        <div>
          <p className="font-body text-caption uppercase tracking-[0.22em] text-gold-base mb-space-2.5">
            {title}
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium text-text-primary mb-space-1.5">
            {name}
          </h2>
          {tenure && (
            <p className="font-body text-caption uppercase tracking-caption text-text-muted">
              {tenure}
            </p>
          )}
        </div>
        <div className="w-9 h-0.5 bg-gold-base" />
        {quote && (
          <blockquote className="m-0 pl-space-5 border-l-[3px] border-gold-base">
            <p className="font-display text-[clamp(1.1rem,2vw,1.5rem)] italic text-text-primary">
              &ldquo;{quote}&rdquo;
            </p>
          </blockquote>
        )}
        {href && (
          <Link
            href={href}
            className="font-body text-caption uppercase tracking-caption text-gold-base inline-flex items-center gap-space-1.5 mt-space-1"
          >
            {readMoreLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

// Grid variant
function StaffCardGrid({
  name,
  title,
  tenure,
  portfolio,
  imageSrc,
  imageAlt,
}: StaffCardProps) {
  return (
    <div className="bg-surface-elevated border border-border-light overflow-hidden flex flex-col">
      <div className="relative aspect-[3/4] bg-green-base overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? name}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-base to-green-hover flex items-center justify-center">
            <span className="font-display text-4xl italic text-gold-base/30">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-overlay-light to-transparent" />
      </div>
      <div className="p-space-4 pb-space-5">
        <h4 className="font-display text-h3 font-medium text-text-primary mb-space-1">
          {name}
        </h4>
        <p className="font-body text-caption uppercase tracking-caption text-gold-base mb-space-1">
          {title}
        </p>
        {portfolio && (
          <p className="font-body text-body-sm text-text-muted">{portfolio}</p>
        )}
        {tenure && (
          <p className="font-body text-caption uppercase tracking-caption text-text-muted mt-space-1.5 opacity-70">
            {tenure}
          </p>
        )}
      </div>
    </div>
  );
}

// Compact variant
function StaffCardCompact({ name, title, imageSrc, imageAlt }: StaffCardProps) {
  return (
    <div className="flex items-center gap-space-3.5 p-space-3.5 bg-surface-elevated border border-border-light">
      <div className="relative w-[52px] h-[52px] rounded-full overflow-hidden bg-green-base border-2 border-border-light flex-shrink-0">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? name}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-2xl italic text-gold-base/50">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="font-body font-medium text-text-primary mb-space-0.5">
          {name}
        </p>
        <p className="font-body text-caption uppercase tracking-caption text-gold-base">
          {title}
        </p>
      </div>
    </div>
  );
}

export function StaffCard({ variant = "grid", ...props }: StaffCardProps) {
  if (variant === "principal") return <StaffCardPrincipal {...props} />;
  if (variant === "compact") return <StaffCardCompact {...props} />;
  return <StaffCardGrid {...props} />;
}
