"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useInView } from "../../hooks/useInView";
import { cn } from "../../utilities/cn";
import { ImageFrame } from "../media/ImageFrame";
import { EyebrowLabel } from "../typography/EyebrowLabel";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  era?: "early" | "mid" | "modern";
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
  prevLabel?: string;
  nextLabel?: string;
  eventsLabel?: string;
  /** aria-label for the progress bar, receives (currentIndex, total) */
  getProgressLabel?: (current: number, total: number) => string;
  /** aria-label for each tab dot, receives the event */
  getEventTabLabel?: (event: TimelineEvent) => string;
}

const eraImageClasses: Record<"early" | "mid" | "modern", string> = {
  early: "sepia-[0.7] contrast-[1.1] brightness-[0.95]",
  mid: "sepia-[0.3] contrast-[1.05]",
  modern: "sepia-0 contrast-100",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Timeline({
  events,
  className,
  prevLabel = "Previous event",
  nextLabel = "Next event",
  eventsLabel = "Timeline events",
  getProgressLabel = (current, total) => `Event ${current} of ${total}`,
  getEventTabLabel = (event) => `Go to ${event.year}: ${event.title}`,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ── Scroll tracking ──────────────────────────────────────────────────────

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use first child width as the snap unit
    const itemWidth =
      (container.firstElementChild as HTMLElement)?.offsetWidth ?? 0;
    if (itemWidth === 0) return;

    const newIndex = Math.round(container.scrollLeft / itemWidth);
    const clamped = Math.max(0, Math.min(newIndex, events.length - 1));
    if (clamped !== activeIndex) setActiveIndex(clamped);
  }, [activeIndex, events.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── Nav buttons ──────────────────────────────────────────────────────────

  const scrollTo = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const itemWidth =
      (container.firstElementChild as HTMLElement)?.offsetWidth ?? 0;
    container.scrollTo({ left: index * itemWidth, behavior: "smooth" });
  }, []);

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < events.length - 1;

  // ── Entrance animation ───────────────────────────────────────────────────

  const { ref: inViewRef, isInView } = useInView<HTMLDivElement>({
    threshold: 0.15,
    triggerOnce: true,
  });

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div ref={inViewRef} className={cn("relative", className)}>
      {/* Progress bar */}
      <div
        className="absolute top-space-0 left-space-0 right-space-0 h-size-px bg-border-light z-raised"
        role="progressbar"
        aria-valuenow={activeIndex + 1}
        aria-valuemin={1}
        aria-valuemax={events.length}
        aria-label={getProgressLabel(activeIndex + 1, events.length)}
      >
        <div
          className="h-full bg-gold-base transition-all duration-standard"
          style={{ width: `${((activeIndex + 1) / events.length) * 100}%` }}
        />
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="kcc-timeline-scroll flex overflow-x-auto snap-x snap-mandatory pt-space-10 pb-space-8"
      >
        {events.map((event, idx) => {
          const isActive = idx === activeIndex;
          const era = event.era ?? "modern";

          return (
            <div
              key={event.id}
              aria-hidden={!isActive}
              className={cn(
                "snap-start shrink-0 w-full md:w-[85%] lg:w-[70%] px-space-6 transition-all duration-slow ease-out",
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              )}
              style={{ transitionDelay: `${idx * 0.08}s` }}
            >
              <div className="grid md:grid-cols-2 gap-space-8 items-center">
                {/* Image */}
                <div
                  className={cn(
                    "transition-all duration-slow",
                    eraImageClasses[era]
                  )}
                >
                  {event.imageSrc ? (
                    <ImageFrame
                      src={event.imageSrc}
                      alt={event.imageAlt ?? event.title}
                      aspectRatio="hero"
                      variant="featured"
                    />
                  ) : (
                    // Placeholder when no image — shows the year in gold
                    <div className="aspect-[4/3] rounded-md bg-surface-deep flex items-center justify-center shadow-elevation-1">
                      <span className="font-display text-h1 text-gold-base/20 select-none">
                        {event.year}
                      </span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-space-3">
                  <EyebrowLabel>{event.year}</EyebrowLabel>
                  <Heading level="h3">{event.title}</Heading>
                  <Text variant="body" color="muted">
                    {event.description}
                  </Text>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-space-4 px-space-6">
        {/* Prev / Next buttons */}
        <div className="flex gap-space-2">
          <button
            onClick={() => scrollTo(activeIndex - 1)}
            disabled={!canPrev}
            aria-label={prevLabel}
            className={cn(
              "w-size-10 h-size-10 rounded-full border-solid flex items-center justify-center",
              "border-border-md border-border-default",
              "font-body text-body-sm text-text-primary",
              "transition-all duration-fast",
              canPrev
                ? "hover:border-gold-base hover:text-gold-base cursor-pointer"
                : "opacity-30 cursor-not-allowed"
            )}
          >
            ←
          </button>
          <button
            onClick={() => scrollTo(activeIndex + 1)}
            disabled={!canNext}
            aria-label={nextLabel}
            className={cn(
              "w-size-10 h-size-10 rounded-full border-solid flex items-center justify-center",
              "border-border-md border-border-default",
              "font-body text-body-sm text-text-primary",
              "transition-all duration-fast",
              canNext
                ? "hover:border-gold-base hover:text-gold-base cursor-pointer"
                : "opacity-30 cursor-not-allowed"
            )}
          >
            →
          </button>
        </div>

        {/* Dot indicators */}
        <div
          className="flex gap-space-2 items-center"
          role="tablist"
          aria-label={eventsLabel}
        >
          {events.map((event, idx) => (
            <button
              key={event.id}
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={getEventTabLabel(event)}
              onClick={() => scrollTo(idx)}
              className={cn(
                "rounded-full transition-all duration-fast cursor-pointer",
                idx === activeIndex
                  ? "w-size-4 h-size-2 bg-gold-base"
                  : "w-size-2 h-size-2 bg-border-default hover:bg-gold-base/50"
              )}
            />
          ))}
        </div>

        {/* Counter */}
        <Text variant="caption" color="muted">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(events.length).padStart(2, "0")}
        </Text>
      </div>

      <style>{`
        .kcc-timeline-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .kcc-timeline-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
