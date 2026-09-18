"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Children, useCallback, useId, useMemo, useRef, useState } from "react";

import { cn } from "../../utilities/cn";
import { Button } from "../atoms/Button";
import { Text } from "../typography/Text";

type SectionSliderVariant = "image-compact" | "image" | "text" | "full";
type SectionSliderDirection = "horizontal" | "vertical";
export interface SectionSliderProps {
  id?: string;
  variant?: SectionSliderVariant;
  direction?: SectionSliderDirection;
  children: React.ReactNode;
  className?: string;
  /**
   * `image-compact` strip only — fraction of container width/height scrolled
   * per arrow press. Defaults to 0.8.
   */
  scrollFraction?: number;
  /** Accessible label for the slider landmark */
  ariaLabel?: string;
  /** Accessible label for the "previous slide" arrow button */
  prevLabel?: string;
  /** Accessible label for the "next slide" arrow button */
  nextLabel?: string;
  /** Accessible label for the slide-dots tablist */
  slidesLabel?: string;
  /** aria-label for the current-slide status text, receives (currentSlide, total) */
  getSlideStatusLabel?: (current: number, total: number) => string;
  /** aria-label for each dot button, receives its 1-based slide number */
  getSlideDotLabel?: (slideNumber: number) => string;
  /**
   * Whether the slider should loop from last → first and first → last.
   * Defaults to false.
   */
  loop?: boolean;
}

const CEREMONIAL_EASE = [0.16, 1, 0.3, 1] as const;

const SLIDE_TRANSITION = { duration: 0.3, ease: CEREMONIAL_EASE };

// Built outside the component so the object reference is stable across renders.
// The `custom` prop carries direction (+1 forward / -1 backward).
const slideVariants = {
  enter: (dir: number) => ({ x: `${dir * 100}%`, opacity: 1 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: `${dir * -100}%`, opacity: 1 }),
};

const slideVariantsVertical = {
  enter: (dir: number) => ({ y: `${dir * 100}%`, opacity: 1 }),
  center: { y: "0%", opacity: 1 },
  exit: (dir: number) => ({ y: `${dir * -100}%`, opacity: 1 }),
};

// Reduced-motion: no translate, just a fast opacity cross-fade
const slideVariantsReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const REDUCED_TRANSITION = { duration: 0 };

// ─── Internal shared icon ─────────────────────────────────────────────────────

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─── Type guard ───────────────────────────────────────────────────────────────

function isSlidingVariant(
  variant: SectionSliderVariant
): variant is "full" | "image" | "text" {
  return ["full", "image", "text"].includes(variant);
}

// ─── SlidingSlider — one slide at a time ─────────────────────────────────────

interface SlidingSliderProps {
  id: string;
  variant: "full" | "image" | "text";
  direction: "horizontal" | "vertical";
  children: React.ReactNode;
  loop: boolean;
  className?: string;
  ariaLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  slidesLabel?: string;
  /** aria-label for the current-slide status text, receives (currentSlide, total) */
  getSlideStatusLabel?: (current: number, total: number) => string;
  /** aria-label for each dot button, receives its 1-based slide number */
  getSlideDotLabel?: (slideNumber: number) => string;
}

function SlidingSlider({
  id,
  variant,
  direction,
  children,
  loop,
  className,
  ariaLabel,
  prevLabel = "Previous slide",
  nextLabel = "Next slide",
  slidesLabel = "Slides",
  getSlideStatusLabel = (current, total) => `Slide ${current} of ${total}`,
  getSlideDotLabel = (n) => `Go to slide ${n}`,
}: SlidingSliderProps) {
  const slides = useMemo(() => Children.toArray(children), [children]);
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [dragDir, setDragDir] = useState<1 | -1>(1);
  const isVertical = direction === "vertical";
  const reduced = useReducedMotion();

  // ── Navigation — functional updaters avoid stale closures ───────────────────

  const prev = useCallback(() => {
    setActive((i) => {
      if (i === 0) return loop ? count - 1 : i;
      setDragDir(-1);
      return i - 1;
    });
  }, [count, loop]);

  const next = useCallback(() => {
    setActive((i) => {
      if (i === count - 1) return loop ? 0 : i;
      setDragDir(1);
      return i + 1;
    });
  }, [count, loop]);

  const goTo = useCallback((i: number) => {
    setActive((prev) => {
      setDragDir(i > prev ? 1 : -1);
      return i;
    });
  }, []);

  // ── Keyboard — inline handler, no document listener ─────────────────────────

  function handleKeyDown(e: React.KeyboardEvent) {
    if (isVertical) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        next();
      }
    } else {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    }
  }

  // ── Variant container widths ─────────────────────────────────────────────────

  const containerClass = cn(
    variant === "full" && "w-full",
    variant === "image" && "max-w-wide mx-auto w-full",
    variant === "text" && "max-w-content mx-auto w-full",
    className
  );

  const canPrev = loop || active > 0;
  const canNext = loop || active < count - 1;

  const motionVariants = reduced
    ? slideVariantsReduced
    : isVertical
    ? slideVariantsVertical
    : slideVariants;

  const motionTransition = reduced ? REDUCED_TRANSITION : SLIDE_TRANSITION;

  return (
    <div
      id={id}
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      aria-live="polite"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn("relative outline-none", containerClass)}
    >
      {/* Viewport — clips the sliding content */}
      <div className="overflow-hidden rounded-sm">
        <AnimatePresence initial={false} custom={dragDir} mode="wait">
          <motion.div
            key={active}
            custom={dragDir}
            variants={motionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={motionTransition}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${active + 1} of ${count}`}
            // Touch + mouse drag
            drag={isVertical ? "y" : "x"}
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              const offset = isVertical ? info.offset.y : info.offset.x;
              const velocity = isVertical ? info.velocity.y : info.velocity.x;
              if (offset < -40 || velocity < -500) next();
              else if (offset > 40 || velocity > 500) prev();
            }}
            className="w-full cursor-grab active:cursor-grabbing select-none"
          >
            {slides[active]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div
        className={cn(
          "flex items-center gap-space-3 mt-space-6",
          isVertical ? "flex-col" : "flex-row justify-center"
        )}
      >
        <Button
          variant="outline"
          size="icon-md"
          onClick={prev}
          disabled={!canPrev}
          aria-label={prevLabel}
          className={cn(
            "rounded-full",
            isVertical ? "rotate-90" : "rotate-180"
          )}
        >
          <ChevronIcon />
        </Button>

        {/* Dot indicators */}
        <div
          role="tablist"
          aria-label={slidesLabel}
          className={cn(
            "flex gap-space-2 items-center",
            isVertical && "flex-col"
          )}
        >
          {Array.from({ length: count }).map((_, i) => (
            <motion.button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              animate={{
                width: i === active ? 16 : 8,
                backgroundColor:
                  i === active
                    ? "var(--color-gold-base)"
                    : "var(--color-border-default)",
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "h-size-2 min-w-2 rounded-full cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-gold-base focus-visible:ring-offset-2",
                "hover:opacity-80"
              )}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon-md"
          onClick={next}
          disabled={!canNext}
          aria-label={nextLabel}
          className="rounded-full"
        >
          <ChevronIcon />
        </Button>

        {/* Slide counter — same pattern as Timeline.tsx */}
        <Text
          variant="caption"
          color="muted"
          className="ml-space-1 tabular-nums"
        >
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(count).padStart(2, "0")}
        </Text>
      </div>
    </div>
  );
}

// ─── StripSlider — scrollable strip (image-compact) ──────────────────────────

interface StripSliderProps {
  id: string;
  direction: "horizontal" | "vertical";
  children: React.ReactNode;
  scrollFraction: number;
  className?: string;
  ariaLabel?: string;
}

function StripSlider({
  id,
  direction,
  children,
  scrollFraction,
  className,
  ariaLabel,
}: StripSliderProps) {
  const isVertical = direction === "vertical";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(true);

  const pointerStart = useRef<{ x: number; y: number; scroll: number } | null>(
    null
  );
  const isDragging = useRef(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (isVertical) {
      setShowStart(el.scrollTop > 4);
      setShowEnd(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
    } else {
      setShowStart(el.scrollLeft > 4);
      setShowEnd(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }
  }, [isVertical]);

  // Register scroll listener + re-run when children change
  const scrollRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current =
        node;
      node.addEventListener("scroll", updateArrows, { passive: true });
      requestAnimationFrame(updateArrows);
    },
    [updateArrows]
  );

  const scroll = useCallback(
    (dir: "start" | "end") => {
      const el = scrollRef.current;
      if (!el) return;
      const amount =
        (isVertical ? el.clientHeight : el.clientWidth) * scrollFraction;
      el.scrollBy({
        [isVertical ? "top" : "left"]: dir === "start" ? -amount : amount,
        behavior: "smooth",
      });
    },
    [isVertical, scrollFraction]
  );

  // ── Keyboard — inline handler ────────────────────────────────────────────────

  function handleKeyDown(e: React.KeyboardEvent) {
    if (isVertical) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        scroll("start");
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scroll("end");
      }
    } else {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scroll("start");
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scroll("end");
      }
    }
  }

  // ── Fade mask ────────────────────────────────────────────────────────────────

  const maskStyle: React.CSSProperties = isVertical
    ? {
        maskImage: `linear-gradient(to bottom,
          transparent 0%,
          black ${showStart ? "8%" : "0%"},
          black ${showEnd ? "92%" : "100%"},
          transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to bottom,
          transparent 0%,
          black ${showStart ? "8%" : "0%"},
          black ${showEnd ? "92%" : "100%"},
          transparent 100%)`,
        touchAction: "pan-x",
      }
    : {
        maskImage: `linear-gradient(to right,
          transparent 0%,
          black ${showStart ? "6%" : "0%"},
          black ${showEnd ? "94%" : "100%"},
          transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to right,
          transparent 0%,
          black ${showStart ? "6%" : "0%"},
          black ${showEnd ? "94%" : "100%"},
          transparent 100%)`,
        touchAction: "pan-y",
      };

  // ── Arrow buttons ─────────────────────────────────────────────────────────────

  function StripArrow({ dir }: { dir: "start" | "end" }) {
    const isStart = dir === "start";
    const visible = isStart ? showStart : showEnd;

    const posClass = isVertical
      ? isStart
        ? "top-2 left-1/2 -translate-x-1/2"
        : "bottom-2 left-1/2 -translate-x-1/2"
      : isStart
      ? "left-2 top-1/2 -translate-y-1/2"
      : "right-2 top-1/2 -translate-y-1/2";

    const rotateClass = isVertical
      ? isStart
        ? "-rotate-90"
        : "rotate-90"
      : isStart
      ? "rotate-180"
      : "";

    const label = isVertical
      ? isStart
        ? "Scroll up"
        : "Scroll down"
      : isStart
      ? "Scroll left"
      : "Scroll right";

    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn("absolute z-10", posClass)}
          >
            <Button
              variant="secondary"
              size="icon-md"
              onClick={() => scroll(dir)}
              aria-label={label}
              className={cn("rounded-full shadow-elevation-2", rotateClass)}
            >
              <ChevronIcon />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div
      id={id}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn("relative outline-none", className)}
    >
      <StripArrow dir="start" />

      <div
        ref={scrollRefCallback}
        className={cn(
          "flex scroll-smooth cursor-grab active:cursor-grabbing",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          isVertical ? "flex-col overflow-y-auto" : "flex-row overflow-x-auto"
        )}
        style={maskStyle}
        onPointerDown={(e) => {
          const el = scrollRef.current;
          if (!el) return;
          isDragging.current = false;
          pointerStart.current = {
            x: e.clientX,
            y: e.clientY,
            scroll: isVertical ? el.scrollTop : el.scrollLeft,
          };
          el.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const el = scrollRef.current;
          if (!el || !pointerStart.current) return;
          const dx = pointerStart.current.x - e.clientX;
          const dy = pointerStart.current.y - e.clientY;
          if (Math.abs(isVertical ? dy : dx) > 4) isDragging.current = true;
          if (isDragging.current) {
            if (isVertical) el.scrollTop = pointerStart.current.scroll + dy;
            else el.scrollLeft = pointerStart.current.scroll + dx;
          }
        }}
        onPointerUp={(e) => {
          const el = scrollRef.current;
          if (el?.hasPointerCapture(e.pointerId)) {
            el.releasePointerCapture(e.pointerId);
          }
          pointerStart.current = null;
        }}
        onPointerCancel={(e) => {
          const el = scrollRef.current;
          if (el?.hasPointerCapture(e.pointerId)) {
            el.releasePointerCapture(e.pointerId);
          }
          pointerStart.current = null;
        }}
      >
        {children}
      </div>

      <StripArrow dir="end" />
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function SectionSlider({
  id: externalId,
  variant = "full",
  direction = "horizontal", // typo preserved for API compat
  children,
  className,
  scrollFraction = 0.8,
  ariaLabel,
  prevLabel,
  nextLabel,
  slidesLabel,
  getSlideStatusLabel,
  getSlideDotLabel,
  loop = false,
}: SectionSliderProps) {
  const autoId = useId();
  const id = externalId ?? autoId;
  // Alias internally so the typo never leaks into logic

  if (isSlidingVariant(variant)) {
    return (
      <SlidingSlider
        id={id}
        variant={variant}
        direction={direction}
        loop={loop}
        className={className}
        ariaLabel={ariaLabel}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        slidesLabel={slidesLabel}
        getSlideStatusLabel={getSlideStatusLabel}
        getSlideDotLabel={getSlideDotLabel}
      >
        {children}
      </SlidingSlider>
    );
  }

  return (
    <StripSlider
      id={id}
      direction={direction}
      scrollFraction={scrollFraction}
      className={className}
      ariaLabel={ariaLabel}
    >
      {children}
    </StripSlider>
  );
}
