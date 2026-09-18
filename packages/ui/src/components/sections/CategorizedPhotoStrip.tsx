// packages/ui/src/components/sections/CategorizedPhotoStrip.tsx
"use client";

import { useRef, useState, useEffect } from "react";

import { cn } from "../../utilities/cn";
import { ImageFrame } from "../media/ImageFrame";

export interface PhotoStripItem {
  id: string;
  imageSrc: string;
  imageAlt: string;
  category: "sports" | "events" | "performances" | "academic";
  title?: string;
}

export interface CategorizedPhotoStripProps {
  items: PhotoStripItem[];
  className?: string;
  allLabel?: string;
  categoryLabels?: Record<PhotoStripItem["category"], string>;
  scrollLeftLabel?: string;
  scrollRightLabel?: string;
}

const DEFAULT_CATEGORY_LABELS: Record<PhotoStripItem["category"], string> = {
  sports: "Sports",
  events: "Events",
  performances: "Performances",
  academic: "Academic",
};

export function CategorizedPhotoStrip({
  items,
  className,
  allLabel = "All",
  categoryLabels = DEFAULT_CATEGORY_LABELS,
  scrollLeftLabel = "Scroll left",
  scrollRightLabel = "Scroll right",
}: CategorizedPhotoStripProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => ref.removeEventListener("scroll", handleScroll);
    }
    // Explicit return when ref is null
    return undefined;
  }, [filteredItems]);

  return (
    <div className={cn("relative", className)}>
      {/* Category filters */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-4 py-2 font-body text-label uppercase tracking-wide rounded-full transition-all",
            activeCategory === "all"
              ? "bg-green-base text-text-inverse"
              : "bg-surface-default text-text-muted hover:bg-surface-deep"
          )}
        >
          {allLabel}
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={cn(
              "px-4 py-2 font-body text-label uppercase tracking-wide rounded-full transition-all",
              activeCategory === key
                ? "bg-green-base text-text-inverse"
                : "bg-surface-default text-text-muted hover:bg-surface-deep"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Horizontal scroll container */}
      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-surface-elevated rounded-full p-2 shadow-elevation-2 hover:bg-gold-base transition-colors"
            aria-label={scrollLeftLabel}
          >
            ←
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth gap-4 pb-4 scrollbar-hide"
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-72 md:w-80 group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg">
                <ImageFrame
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  aspectRatio="news"
                  variant="standard"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-overlay-heavy to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-text-inverse font-body text-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </div>
                )}
              </div>
              <p className="mt-2 text-center font-body text-caption uppercase tracking-wide text-text-muted">
                {categoryLabels[item.category]}
              </p>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-surface-elevated rounded-full p-2 shadow-elevation-2 hover:bg-gold-base transition-colors"
            aria-label={scrollRightLabel}
          >
            →
          </button>
        )}
      </div>

      <style>{`
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
