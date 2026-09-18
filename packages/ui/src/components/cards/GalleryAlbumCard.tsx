import type { GalleryAlbumCardData } from "@paideon/contracts";
import Image from "next/image";
import Link from "next/link";

import { cn } from "../../utilities/cn";
import { Badge } from "../atoms/Badge";

export interface GalleryAlbumCardProps extends GalleryAlbumCardData {
  className?: string;
  viewAlbumLabel?: string;
  /** Photo-count label builder, receives the count */
  getPhotoCountLabel?: (count: number) => string;
}

export function GalleryAlbumCard({
  title,
  year,
  photoCount,
  category,
  href,
  coverSrc,
  coverAlt,
  className,
  viewAlbumLabel = "View Album",
  getPhotoCountLabel = (count) => `${count} photos`,
}: GalleryAlbumCardProps) {
  return (
    <Link href={href} className="group block no-underline">
      <div
        className={cn(
          "relative overflow-hidden",
          "shadow-elevation-1 transition-all duration-gentle",
          "group-hover:shadow-elevation-3 group-hover:-translate-y-0.5",
          className
        )}
      >
        {/* Cover */}
        <div className="relative aspect-[4/3] bg-green-base overflow-hidden">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={coverAlt ?? title}
              fill
              className="object-cover transition-transform duration-gentle group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-base to-green-hover" />
          )}
          {/* Hover overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-overlay-medium flex items-center justify-center",
              "opacity-0 transition-opacity duration-gentle group-hover:opacity-100"
            )}
          >
            <span className="font-body text-caption uppercase tracking-caption text-text-inverse border border-text-inverse/60 px-space-5 py-space-2">
              {viewAlbumLabel}
            </span>
          </div>
          {/* Category badge */}
          {category && (
            <div className="absolute top-space-3 left-space-3">
              <Badge variant="category" label={category} />
            </div>
          )}
          {/* Photo count */}
          <div className="absolute bottom-space-3 right-space-3 bg-overlay-heavy px-space-2.5 py-space-1">
            <span className="font-body text-caption uppercase tracking-caption text-text-inverse">
              {getPhotoCountLabel(photoCount)}
            </span>
          </div>
        </div>
        {/* Info bar */}
        <div
          className={cn(
            "p-space-3.5 bg-surface-elevated border border-border-light border-t-0",
            "flex items-center justify-between gap-space-3"
          )}
        >
          <h3
            className={cn(
              "font-display text-body font-medium text-text-primary truncate",
              "transition-colors duration-fast group-hover:text-gold-active"
            )}
          >
            {title}
          </h3>
          <span className="font-body text-caption uppercase tracking-caption text-gold-base flex-shrink-0">
            {year}
          </span>
        </div>
      </div>
    </Link>
  );
}
