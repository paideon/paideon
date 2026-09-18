"use client";

import { cn } from "../../utilities/cn";
import { ImageFrame } from "../media/ImageFrame";

export interface SocietyBannerProps {
  name: string;
  foundingYear?: number;
  coverImageSrc?: string;
  coverImageAlt?: string;
  className?: string;
}

export function SocietyBanner({
  name,
  foundingYear,
  coverImageSrc,
  coverImageAlt,
  className,
}: SocietyBannerProps) {
  return (
    <div
      className={cn(
        "relative h-48 md:h-64 lg:h-80 overflow-hidden rounded-lg",
        className
      )}
    >
      {coverImageSrc ? (
        <ImageFrame
          src={coverImageSrc}
          alt={coverImageAlt || name}
          aspectRatio="hero"
          variant="full-bleed"
          className="h-full"
        />
      ) : (
        <div className="w-full h-full bg-green-base flex items-center justify-center">
          <span className="font-display text-6xl text-gold-base/30">
            {name.charAt(0)}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-overlay-heavy to-transparent flex items-end p-space-6">
        <div>
          <h1 className="font-display text-3xl md:text-5xl text-text-inverse">
            {name}
          </h1>
          {foundingYear && (
            <p className="font-body text-caption uppercase tracking-wider text-gold-base mt-space-2">
              Est. {foundingYear}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
