import type { ArchiveCardData } from "@paideon/contracts";
import Image from "next/image";

import { cn } from "../../utilities/cn";

export interface ArchiveCardProps extends ArchiveCardData {
  className?: string;
  categoryLabel?: string;
  yearLabel?: string;
}

export function ArchiveCard({
  id,
  title,
  year,
  category,
  fileSrc,
  fileAlt,
  className,
  categoryLabel = "",
  yearLabel = "",
}: ArchiveCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-elevated border border-border-light overflow-hidden",
        "shadow-elevation-1 transition-all duration-gentle",
        "hover:shadow-elevation-2 hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="relative aspect-[4/3] bg-green-base overflow-hidden flex-shrink-0">
          <Image
            src={fileSrc}
            alt={fileAlt || title}
            fill
            className="object-cover transition-transform duration-gentle hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-overlay-medium to-transparent" />
          <div className="absolute top-0 left-0 right-0 p-space-3 flex justify-between items-start">
            {category && (
              <span className="bg-semantic-success-base text-white px-space-2 py-space-1 text-xs rounded-full font-medium">
                {categoryLabel}
                {category}
              </span>
            )}
          </div>
        </div>
        <div className="p-space-4 flex-1 flex flex-col">
          <h3 className="font-display text-h3 font-medium text-text-primary mb-space-2 line-clamp-2">
            {title}
          </h3>
          <div className="mt-auto flex items-center gap-space-2 text-sm text-text-muted">
            <span>
              {yearLabel}
              {year}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
