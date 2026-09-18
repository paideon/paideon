import type {
  SocietyCardData,
  SocietyCardVariantType,
} from "@paideon/contracts";
import Image from "next/image";
import Link from "next/link";

import { cn } from "../../utilities/cn";
import { Badge } from "../atoms/Badge";

export interface SocietyCardProps extends Omit<SocietyCardData, "variant"> {
  variant?: SocietyCardVariantType;
  className?: string;
  membersLabel?: string;
  foundedLabel?: string;
  learnMoreLabel?: string;
  featuredLabel?: string;
}

// Hub grid variant
function SocietyCardHub({
  name,
  tagline,
  category,
  href,
  imageSrc,
  imageAlt,
  memberCount,
  founded,
  membersLabel = "members",
  foundedLabel = "Est.",
}: SocietyCardProps) {
  return (
    <Link href={href} className="group block no-underline h-full">
      <div
        className={cn(
          "h-full flex flex-col bg-surface-elevated border border-border-light overflow-hidden",
          "shadow-elevation-1 transition-all duration-gentle",
          "group-hover:shadow-elevation-3 group-hover:-translate-y-0.5"
        )}
      >
        <div className="relative aspect-[4/3] bg-green-base overflow-hidden flex-shrink-0">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt ?? name}
              fill
              className="object-cover transition-transform duration-gentle group-hover:scale-[1.05]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-base to-green-hover flex items-center justify-center">
              <span className="font-display text-4xl italic text-gold-base/30">
                {name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-overlay-medium to-transparent" />
        </div>
        <div className="p-space-5 flex flex-col flex-1">
          <div className="mb-space-3">
            <Badge variant="category" label={category} />
          </div>
          <h3
            className={cn(
              "font-display text-h3 font-medium text-text-primary mb-space-2",
              "transition-colors duration-fast group-hover:text-gold-active"
            )}
          >
            {name}
          </h3>
          <p className="font-body text-body-sm text-text-muted leading-relaxed flex-1">
            {tagline}
          </p>
          {(memberCount !== undefined || founded) && (
            <div className="flex items-center gap-space-4 mt-space-4 pt-space-4 border-t border-border-light">
              {memberCount !== undefined && (
                <span className="font-body text-caption uppercase tracking-caption text-text-muted">
                  {memberCount} {membersLabel}
                </span>
              )}
              {founded && (
                <span className="font-body text-caption uppercase tracking-caption text-text-muted">
                  {foundedLabel} {founded}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Featured variant (KITS)
function SocietyCardFeatured({
  name,
  tagline,
  category,
  href,
  imageSrc,
  imageAlt,
  memberCount,
  founded,
  membersLabel = "Members",
  foundedLabel = "Founded",
  learnMoreLabel = "Learn more →",
  featuredLabel = "Featured",
}: SocietyCardProps) {
  return (
    <Link href={href} className="group block no-underline">
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 bg-surface-elevated border-2 border-gold-base overflow-hidden",
          "shadow-[0_4px_20px_rgba(201,151,58,0.12)] transition-shadow duration-gentle",
          "group-hover:shadow-[0_8px_40px_rgba(201,151,58,0.2)]"
        )}
      >
        <div className="relative min-h-[280px] bg-green-base overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt ?? name}
              fill
              className="object-cover transition-transform duration-gentle group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-base to-green-hover flex items-center justify-center">
              <span className="font-display text-6xl italic text-gold-base/30">
                {name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gold-base" />
        </div>
        <div className="p-space-9 md:p-space-10 flex flex-col justify-center">
          <p className="font-body text-caption uppercase tracking-[0.25em] text-gold-base mb-space-3">
            {category} — {featuredLabel}
          </p>
          <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-medium text-text-primary mb-space-4">
            {name}
          </h3>
          <p className="font-body text-body text-text-muted leading-relaxed mb-space-6">
            {tagline}
          </p>
          {(memberCount !== undefined || founded) && (
            <div className="flex items-center gap-space-6 mb-space-6 pb-space-6 border-b border-border-light">
              {memberCount !== undefined && (
                <div>
                  <p className="font-display text-h2 font-medium text-gold-base leading-none">
                    {memberCount}+
                  </p>
                  <p className="font-body text-caption uppercase tracking-caption text-text-muted">
                    {membersLabel}
                  </p>
                </div>
              )}
              {founded && (
                <div>
                  <p className="font-display text-h2 font-medium text-gold-base leading-none">
                    {founded}
                  </p>
                  <p className="font-body text-caption uppercase tracking-caption text-text-muted">
                    {foundedLabel}
                  </p>
                </div>
              )}
            </div>
          )}
          <span className="font-body text-caption uppercase tracking-caption text-gold-base">
            {learnMoreLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function SocietyCard({
  variant = "hub-grid",
  ...props
}: SocietyCardProps) {
  if (variant === "featured") return <SocietyCardFeatured {...props} />;
  return <SocietyCardHub {...props} />;
}
