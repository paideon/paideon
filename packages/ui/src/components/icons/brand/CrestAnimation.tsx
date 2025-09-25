'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { memo, useEffect } from 'react';

import { SchoolLogo } from './SchoolLogo';
import { cn } from '../../../utilities/cn';

// -----------------------------------------------------------------------------
// Size map
// -----------------------------------------------------------------------------
const sizeMap = {
  sm: 'w-size-24 h-size-24',
  md: 'w-size-32 h-size-32',
  lg: 'w-size-48 h-size-48',
} as const;

type CrestSize = keyof typeof sizeMap;

export interface CrestAnimationProps {
  size?: CrestSize;
  /**
   * 'hero'    — fade-in, single gold sweep, settles into faint glow.
   * 'loading' — continuous breathing glow, static crest.
   */
  variant?: 'hero' | 'loading';
  /** Play the intro animation on mount (default: true) */
  animateOnMount?: boolean;
  /**
   * Called once the intro sequence finishes.
   * Only relevant for 'hero' variant; fires after the entrance
   * transition (600 ms) via a timer — not onAnimationComplete —
   * so it isn't re-triggered by subsequent child animations.
   */
  onComplete?: () => void;
  className?: string;
}

// -----------------------------------------------------------------------------
// Hero variant: fade-in → single sweep → settles to faint idle glow
// -----------------------------------------------------------------------------
const HeroAnimation = ({
  size,
  onComplete,
}: {
  size: CrestSize;
  onComplete?: () => void;
}) => {
  const reduced = useReducedMotion();

  // Fire onComplete after the entrance duration (600 ms).
  // Timer-based so it never re-fires when child animations tick.
  useEffect(() => {
    if (!onComplete) return;
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (reduced) {
    return (
      <div className={cn('relative', sizeMap[size])}>
        <SchoolLogo variant="crest-only" className="w-full h-full" />
      </div>
    );
  }

  return (
    <motion.div
      className={cn('relative', sizeMap[size])}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Crest logo */}
      <SchoolLogo
        variant="crest-only"
        className="w-full h-full relative z-raised"
      />

      {/*
        Diagonal gold sweep — fires once, no repeat.
        w-full h-full so it always covers the crest regardless of size.
        overflow-hidden on the wrapper clips it cleanly.
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        <motion.div
          className="absolute w-full h-full bg-gradient-to-br from-transparent via-gold-base/40 to-transparent blur-md"
          style={{ transform: 'rotate(45deg) scale(2)' }}
          initial={{ x: '-100%', y: '-100%', opacity: 0 }}
          animate={{
            x: ['-100%', '100%'],
            y: ['-100%', '100%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.6,
            ease: [0.4, 0, 0.2, 1],
            times: [0, 0.35, 1],
            // No repeat — sweep fires once and the crest settles.
          }}
        />
      </div>

      {/*
        Idle glow — delayed until after the entrance (0.6s).
        Fades to opacity-20 and holds; no loop.
        bg-gold-base/20 = valid token (opacity 20 is in the scale).
        blur-lg = largest valid blur token (16px).
      */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gold-base/20 pointer-events-none z-0 blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.2] }}
        transition={{
          duration: 2.0,
          delay: 0.6,
          ease: 'easeOut',
          times: [0, 0.4, 1],
          // No repeat — glow fades in and holds at a steady value.
        }}
      />
    </motion.div>
  );
};

// -----------------------------------------------------------------------------
// Loading variant: continuous breathing glow, static crest
// -----------------------------------------------------------------------------
const LoadingAnimation = ({ size }: { size: CrestSize }) => {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={cn('relative', sizeMap[size])}>
        <SchoolLogo variant="crest-only" className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className={cn('relative', sizeMap[size])}>
      {/*
        Outer breathing glow.
        bg-gold-base/20 — valid.  blur-lg — largest valid blur token.
      */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gold-base/20 blur-lg pointer-events-none"
        animate={{
          scale: [0.85, 1.15, 0.85],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Crest — stays still throughout */}
      <SchoolLogo
        variant="crest-only"
        className="w-full h-full relative z-raised"
      />

      {/*
        Inner pulse — slightly offset phase for organic feel.
        bg-gold-base/10 — valid.  blur-sm — valid token (4px).
      */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gold-base/10 pointer-events-none blur-sm"
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3,
        }}
      />
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------
export const CrestAnimation = memo(function CrestAnimation({
  size = 'md',
  variant = 'hero',
  animateOnMount = true,
  onComplete,
  className,
}: CrestAnimationProps) {
  if (!animateOnMount) {
    return (
      <div className={cn('relative', sizeMap[size], className)}>
        <SchoolLogo variant="crest-only" className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      {variant === 'hero' ? (
        <HeroAnimation size={size} onComplete={onComplete} />
      ) : (
        <LoadingAnimation size={size} />
      )}
    </div>
  );
});
