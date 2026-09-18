// packages/ui/src/components/sections/ProfileCarousel.tsx
"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";

import { cn } from "../../utilities/cn";
import { Button } from "../atoms/Button";
import { Icon } from "../icons";
import { Container } from "../layout/Container";
import { ImageFrame } from "../media/ImageFrame";
import { QuoteBlock } from "../typography/QuoteBlock";

interface AlumniProfile {
  id: string;
  name: string;
  graduationYear: string;
  currentRole?: string;
  currentOrg?: string;
  quote?: string;
  portrait?: {
    src: string;
    alt: string;
  };
}

interface ProfileCarouselProps {
  profiles: AlumniProfile[];
  className?: string;
  allYearsLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  /** Slide-dot aria-label builder, receives the 1-based slide number */
  getSlideLabel?: (slideNumber: number) => string;
  /** "Class of {year}" builder */
  getClassOfLabel?: (year: string) => string;
  /** Screen-reader status announcement, receives (current, total) */
  getSlideStatusLabel?: (current: number, total: number) => string;
}

// Same ease/duration as SectionSlider — every carousel-like moment on the
// site moves to the same rhythm instead of each one inventing its own feel.
const CEREMONIAL_EASE = [0.16, 1, 0.3, 1] as const;
const SLIDE_TRANSITION = { duration: 0.35, ease: CEREMONIAL_EASE };
const REDUCED_TRANSITION = { duration: 0 };

// Small opposed-direction shift rather than a full slide — this block swaps
// a portrait + quote, not a full-bleed image, so a large translate would
// overpower the content instead of supporting it.
const slideVariants = {
  enter: (dir: number) => ({ x: dir * 16, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -16, opacity: 0 }),
};

const slideVariantsReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export function ProfileCarousel({
  profiles,
  className,
  allYearsLabel = "All Years",
  prevLabel = "Previous profile",
  nextLabel = "Next profile",
  getSlideLabel = (n) => `Go to slide ${n}`,
  getClassOfLabel = (year) => `Class of ${year}`,
  getSlideStatusLabel = (current, total) => `Profile ${current} of ${total}`,
}: ProfileCarouselProps) {
  const [selectedYear, setSelectedYear] = useState<string | "all">("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const reduced = useReducedMotion();
  const statusId = useId();

  // Cast years to Number for accurate descending sorting
  const years = Array.from(new Set(profiles.map((a) => a.graduationYear))).sort(
    (a, b) => Number(b) - Number(a)
  );

  const filteredProfiles =
    selectedYear === "all"
      ? profiles
      : profiles.filter((a) => a.graduationYear === selectedYear);

  const currentProfile = filteredProfiles[activeIndex];
  const hasMultiple = filteredProfiles.length > 1;

  // Resets index when the filter changes so activeIndex can't point past the end of the new, shorter list
  const handleYearChange = (year: string | "all") => {
    setSelectedYear(year);
    setActiveIndex(0);
    setDirection(1);
  };

  const next = () => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % filteredProfiles.length);
  };

  const prev = () => {
    setDirection(-1);
    setActiveIndex(
      (i) => (i - 1 + filteredProfiles.length) % filteredProfiles.length
    );
  };

  const goTo = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!hasMultiple) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  }

  if (filteredProfiles.length === 0) return null;

  const variants = reduced ? slideVariantsReduced : slideVariants;
  const transition = reduced ? REDUCED_TRANSITION : SLIDE_TRANSITION;

  return (
    <Container className={className}>
      {/* Year filter */}
      <div className="flex justify-center gap-space-2 mb-space-10 flex-wrap">
        <button
          onClick={() => handleYearChange("all")}
          aria-pressed={selectedYear === "all"}
          className={cn(
            "px-space-3 py-space-1 font-body text-body-sm rounded-full border transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-base focus-visible:ring-offset-2",
            selectedYear === "all"
              ? "bg-green-base border-transparent text-text-inverse"
              : "bg-transparent border-border-default text-text-muted hover:border-gold-hover hover:text-gold-hover"
          )}
        >
          {allYearsLabel}
        </button>
        {years.map((year) => (
          <button
            key={year}
            onClick={() => handleYearChange(year)}
            aria-pressed={selectedYear === year}
            className={cn(
              "px-space-3 py-space-1 font-body text-body-sm rounded-full border transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-base focus-visible:ring-offset-2",
              selectedYear === year
                ? "bg-green-base border-transparent text-text-inverse"
                : "bg-transparent border-border-default text-text-muted hover:border-gold-hover hover:text-gold-hover"
            )}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Portrait + quote */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={allYearsLabel}
        tabIndex={hasMultiple ? 0 : -1}
        onKeyDown={handleKeyDown}
        className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-gold-base focus-visible:ring-offset-2"
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentProfile.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="grid gap-space-8 md:grid-cols-5 md:gap-space-12 items-center"
          >
            {currentProfile.portrait && (
              <div className="mx-auto w-full max-w-size-64 md:col-span-2 md:max-w-none">
                <ImageFrame
                  src={currentProfile.portrait.src}
                  alt={currentProfile.portrait.alt || currentProfile.name}
                  aspectRatio="portrait"
                  variant="featured"
                  frameColor="gold"
                  frameWidth="border-md"
                  className="w-size-screen-w-25"
                />
              </div>
            )}

            <div
              className={cn(
                "text-center",
                currentProfile.portrait
                  ? "md:col-span-3 md:text-left"
                  : "md:col-span-5"
              )}
            >
              {currentProfile.quote && (
                <QuoteBlock
                  quote={currentProfile.quote}
                  className={cn(
                    "mx-auto mb-space-6",
                    currentProfile.portrait && "md:mx-0"
                  )}
                />
              )}

              <p className="font-display text-h3 text-text-heading">
                {currentProfile.name}
              </p>

              {(currentProfile.currentRole || currentProfile.currentOrg) && (
                <p className="font-body text-body-sm text-text-muted mt-space-1">
                  {currentProfile.currentRole}
                  {currentProfile.currentOrg &&
                    ` · ${currentProfile.currentOrg}`}
                </p>
              )}

              <p className="font-body text-eyebrow text-gold-base mt-space-2">
                {getClassOfLabel(currentProfile.graduationYear)}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Screen-reader-only status announcement — visual state lives in the dots below */}
      <p aria-live="polite" className="sr-only">
        {getSlideStatusLabel(activeIndex + 1, filteredProfiles.length)}
      </p>

      {/* Carousel controls */}
      {hasMultiple && (
        <div className="flex items-center justify-center gap-space-4 mt-space-10">
          <Button
            variant="outline"
            size="icon-md"
            onClick={prev}
            aria-label={prevLabel}
            className="rounded-full w-size-12 h-size-12 p-space-0"
          >
            <Icon name="chevron-left" />
          </Button>

          <div
            role="tablist"
            aria-label={allYearsLabel}
            id={statusId}
            className="flex items-center gap-space-2"
          >
            {filteredProfiles.map((a, idx) => (
              <button
                key={a.id}
                role="tab"
                aria-selected={idx === activeIndex}
                onClick={() => goTo(idx)}
                className={cn(
                  "h-size-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-base focus-visible:ring-offset-2",
                  idx === activeIndex
                    ? "w-size-6 bg-gold-base"
                    : "w-size-2 bg-border-default hover:bg-gold-pale"
                )}
                aria-label={getSlideLabel(idx + 1)}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon-md"
            onClick={next}
            aria-label={nextLabel}
            className="rounded-full w-size-12 h-size-12 p-space-0"
          >
            <Icon name="chevron-right" />
          </Button>
        </div>
      )}
    </Container>
  );
}
