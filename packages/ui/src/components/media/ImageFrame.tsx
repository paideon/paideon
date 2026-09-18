"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "../../utilities/cn";

type ImageFrameAspectRatio = "hero" | "portrait" | "square" | "news" | "event";
type ImageFrameVariant = "standard" | "featured" | "full-bleed";

type ImageFrameColor =
  | "gold"
  | "gold-pale"
  | "green"
  | "border-default"
  | "border-light"
  | "surface-inverse"
  | "white";

type ImageOverlay = "light" | "medium" | "heavy" | false;
type FrameWidth =
  | "border-sm"
  | "border-md"
  | "border-lg"
  | "border-xl"
  | "border-2xl";

type ImageFrameSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

interface ImageFrameProps {
  src: string;
  alt: string;
  aspectRatio?: ImageFrameAspectRatio;
  variant?: ImageFrameVariant;
  caption?: string;
  overlay?: ImageOverlay;
  cornerBadge?: React.ReactNode;
  className?: string;
  priority?: boolean;
  size?: ImageFrameSize;
  frameColor?: ImageFrameColor;
  frameWidth?: FrameWidth;
  unavailableLabel?: string;
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const sizeWidthMap: Record<ImageFrameSize, string> = {
  xs: "w-size-32",
  sm: "w-size-48",
  md: "w-size-64",
  lg: "w-size-96",
  xl: "w-size-128",
  full: "w-full",
};
const aspectRatioMap: Record<ImageFrameAspectRatio, string> = {
  hero: "aspect-hero",
  portrait: "aspect-portrait",
  square: "aspect-square",
  news: "aspect-news",
  event: "aspect-event",
};

const overlayMap: Record<"light" | "medium" | "heavy", string> = {
  light: "bg-overlay-light",
  medium: "bg-overlay-medium",
  heavy: "bg-overlay-heavy",
};

const variantClasses: Record<ImageFrameVariant, string> = {
  standard: "rounded-md",
  featured: "rounded-md",
  "full-bleed": "rounded-none",
};

const variantShadow: Record<ImageFrameVariant, string> = {
  standard: "shadow-elevation-1",
  featured: "shadow-elevation-2",
  "full-bleed": "shadow-none",
};

const frameColorMap: Record<ImageFrameColor, string> = {
  gold: "border-gold-base",
  "gold-pale": "border-gold-pale",
  green: "border-green-base",
  "border-default": "border-border-default",
  "border-light": "border-border-light",
  "surface-inverse": "border-surface-inverse",
  white: "border-white",
};

const frameWidthMap: Record<
  NonNullable<ImageFrameProps["frameWidth"]>,
  string
> = {
  "border-sm": "border-border-sm",
  "border-md": "border-border-md",
  "border-lg": "border-border-lg",
  "border-xl": "border-border-xl",
  "border-2xl": "border-border-2xl",
};

export function ImageFrame({
  src,
  alt,
  aspectRatio = "hero",
  variant = "standard",
  caption,
  overlay = false,
  cornerBadge,
  className,
  priority = false,
  size = "full",
  frameWidth = "border-sm",
  frameColor,
  unavailableLabel = "Image unavailable",
}: ImageFrameProps) {
  const [error, setError] = useState(false);
  const hasFrame = Boolean(frameWidth);

  return (
    <figure
      className={cn(
        "w-full overflow-hidden",
        sizeWidthMap[size],
        variantClasses[variant],
        variantShadow[variant],
        hasFrame && [
          "border-solid",
          frameWidthMap[frameWidth],
          frameColor && frameColorMap[frameColor],
        ],
        className
      )}
    >
      {/* Image container — relative positioning context for all absolute children */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-surface-deep",
          aspectRatioMap[aspectRatio]
        )}
      >
        {/* z-base (0): image layer — the ground floor */}
        {!error ? (
          <Image
            src={src}
            alt={alt}
            fill
            className={cn(
              "object-cover z-base",
              "transition-transform duration-gentle group-hover:scale-[1.04]"
            )}
            sizes={size}
            priority={priority}
            onError={() => setError(true)}
          />
        ) : (
          // Error state — sits at z-raised so it covers the broken img slot
          <div
            className={cn(
              "absolute z-raised",
              // inset via explicit top/right/bottom/left using space tokens
              // (inset-0 broken because spacing is fully overridden — see preset.ts)
              "top-space-0 right-space-0 bottom-space-0 left-space-0",
              "flex items-center justify-center bg-surface-deep"
            )}
          >
            <span className="font-body text-caption text-text-muted">
              {unavailableLabel}
            </span>
          </div>
        )}

        {/* z-raised (10): overlay — above the image, below badges */}
        {overlay && (
          <div
            className={cn(
              "absolute z-raised pointer-events-none",
              "top-space-0 right-space-0 bottom-space-0 left-space-0",
              overlayMap[overlay]
            )}
          />
        )}

        {/* z-dropdown (100): corner badge — always on top of overlays */}
        {cornerBadge && (
          <div className="absolute z-dropdown top-space-3 left-space-3">
            {cornerBadge}
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="mt-space-2 font-body text-caption text-text-muted text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
