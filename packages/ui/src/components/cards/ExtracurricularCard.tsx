import type {
  ActivityData,
  ExtracurricularVariantType,
} from "@paideon/contracts";
import Image from "next/image";
import Link from "next/link";

import { cn } from "../../utilities/cn";
import { Badge } from "../atoms/Badge";

export interface ExtracurricularCardProps
  extends Omit<ActivityData, "variant"> {
  variant?: ExtracurricularVariantType;
  className?: string;
}

const ACCENT_COLORS: Record<ExtracurricularVariantType, string> = {
  sport: "bg-green-base",
  "performing-arts": "bg-gold-base",
  leadership: "bg-green-base",
};

export function ExtracurricularCard({
  variant = "sport",
  name,
  description,
  recentAchievements,
  teacherInCharge,
  studentQuote,
  season,
  href,
  imageSrc,
  imageAlt,
  className,
}: ExtracurricularCardProps) {
  const accent = ACCENT_COLORS[variant];
  const imageAspect =
    variant === "performing-arts" ? "aspect-[4/3]" : "aspect-[16/9]";

  const content = (
    <div
      className={cn(
        "bg-surface-elevated border border-border-light overflow-hidden",
        "shadow-elevation-1 transition-all duration-gentle",
        "group-hover:shadow-elevation-3 group-hover:-translate-y-0.5",
        className
      )}
    >
      {imageSrc && (
        <div
          className={cn("relative overflow-hidden bg-green-base", imageAspect)}
        >
          <Image
            src={imageSrc}
            alt={imageAlt ?? name}
            fill
            className="object-cover transition-transform duration-gentle group-hover:scale-[1.04]"
          />
          {season && (
            <div className="absolute top-space-3 right-space-3">
              <Badge variant="category" label={season} />
            </div>
          )}
        </div>
      )}
      <div className={cn("h-1", accent)} />
      <div
        className={cn(
          "p-space-5",
          variant === "performing-arts" && "p-space-7"
        )}
      >
        <h3
          className={cn(
            "font-display text-h3 font-medium text-text-primary mb-space-2",
            "transition-colors duration-fast group-hover:text-gold-active"
          )}
        >
          {name}
        </h3>
        <p className="font-body text-body-sm text-text-muted leading-relaxed mb-space-4">
          {description}
        </p>

        {recentAchievements && recentAchievements.length > 0 && (
          <ul className="list-none p-0 m-0 flex flex-col gap-space-1 mb-space-4">
            {recentAchievements.map((ach) => (
              <li key={ach} className="flex gap-space-2 items-baseline">
                <span
                  className={cn(
                    "text-xs flex-shrink-0",
                    accent.replace("bg-", "text-")
                  )}
                >
                  ●
                </span>
                <span className="font-body text-caption text-text-muted">
                  {ach}
                </span>
              </li>
            ))}
          </ul>
        )}

        {variant === "performing-arts" && studentQuote && (
          <blockquote className="m-0 pl-space-3.5 border-l-2 border-gold-base mb-space-4">
            <p className="font-display italic text-body-sm text-text-muted">
              &ldquo;{studentQuote}&rdquo;
            </p>
          </blockquote>
        )}

        {teacherInCharge && (
          <p className="font-body text-caption uppercase tracking-caption text-text-muted">
            Teacher in charge — {teacherInCharge}
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
