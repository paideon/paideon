import type {
  FacilityCardData,
  FacilityCardVariantType,
} from "@paideon/contracts";
import Image from "next/image";
import Link from "next/link";

import { cn } from "../../utilities/cn";

export interface FacilityCardProps extends Omit<FacilityCardData, "variant"> {
  variant?: FacilityCardVariantType;
  className?: string;
  scheduleLabel?: string;
}

export function FacilityCard({
  variant = "standard",
  name,
  description,
  features,
  href,
  imageSrc,
  imageAlt,
  schedule,
  className,
  scheduleLabel = "Schedule",
}: FacilityCardProps) {
  const content = (
    <div
      className={cn(
        "bg-surface-elevated border border-border-light overflow-hidden",
        "shadow-elevation-1 transition-all duration-gentle",
        "group-hover:shadow-elevation-3 group-hover:-translate-y-0.5",
        className
      )}
    >
      <div className="relative aspect-[16/9] bg-green-base overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? name}
            fill
            className="object-cover transition-transform duration-gentle group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-base to-green-hover" />
        )}
      </div>
      <div className="p-space-6">
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
        <ul className="list-none p-0 m-0 flex flex-col gap-space-1.5 mb-space-4">
          {features?.map((feat) => (
            <li key={feat} className="flex items-center gap-space-2">
              <span className="text-green-base text-xs flex-shrink-0">●</span>
              <span className="font-body text-body-sm text-text-muted">
                {feat}
              </span>
            </li>
          ))}
        </ul>
        {variant === "schedule" && schedule && schedule.length > 0 && (
          <div>
            <p className="font-body text-caption uppercase tracking-caption text-text-muted mb-space-2.5">
              {scheduleLabel}
            </p>
            <table className="w-full border-collapse">
              <tbody>
                {schedule.map((slot, i) => (
                  <tr
                    key={`${slot.day}-${slot.time}`}
                    className={cn(
                      "border-b border-border-light",
                      i % 2 === 0 ? "bg-surface-base" : "bg-surface-default"
                    )}
                  >
                    <td className="font-body text-caption text-gold-base font-semibold p-space-1.5 whitespace-nowrap">
                      {slot.day}
                    </td>
                    <td className="font-body text-caption text-text-muted p-space-1.5 whitespace-nowrap">
                      {slot.time}
                    </td>
                    <td className="font-body text-caption text-text-primary p-space-1.5">
                      {slot.group}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
