// hooks/useCountUp.ts
'use client';
import { useMotionValue, animate, type MotionValue } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useInView } from './useInView';

export interface UseCountUpOptions {
  duration?: number;
  delay?: number;
  ease?: [number, number, number, number]; // cubic bezier — don't use strings
  onComplete?: () => void;
  animated?: boolean;
  startOnVisible?: boolean;
  threshold?: number;
}

export interface UseCountUpReturn {
  value: MotionValue<number>;
  start: () => void;
  reset: () => void;
  ref: React.RefObject<HTMLElement | null>;
  isAnimating: boolean;
  isComplete: boolean;
}

// Front-loads momentum, decelerates smoothly into the target.
// Feels heavier and more deliberate than easeOut.
const DEFAULT_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Scale duration slightly with magnitude so large numbers don't blur.
function deriveDuration(target: number, base: number): number {
  if (target <= 100) return Math.min(base, 1.0);
  if (target <= 1_000) return base;
  if (target <= 10_000) return base * 1.15;
  return base * 1.3;
}

export function useCountUp(
  target: number,
  options: UseCountUpOptions = {},
): UseCountUpReturn {
  const {
    duration = 1.8,
    delay = 0,
    ease = DEFAULT_EASE,
    onComplete,
    animated = true,
    startOnVisible = true,
    threshold = 0.3,
  } = options;

  const motionValue = useMotionValue(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use refs for guard flags so `start` doesn't need them in its dep array.
  const isAnimatingRef = useRef(false);
  const isCompleteRef = useRef(false);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const { ref: inViewRef, isInView } = useInView({
    threshold,
    triggerOnce: true,
  });

  const start = useCallback(() => {
    if (isAnimatingRef.current || isCompleteRef.current) return;

    if (!animated) {
      motionValue.set(target);
      isCompleteRef.current = true;
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const scaledDuration = deriveDuration(target, duration);

    const run = () => {
      isAnimatingRef.current = true;
      setIsAnimating(true);

      animationRef.current = animate(motionValue, target, {
        duration: scaledDuration,
        ease,
        onComplete: () => {
          isAnimatingRef.current = false;
          isCompleteRef.current = true;
          setIsAnimating(false);
          setIsComplete(true);
          onComplete?.();
        },
      });
    };

    if (delay > 0) {
      timeoutRef.current = setTimeout(run, delay * 1000);
    } else {
      run();
    }
  }, [target, animated, duration, ease, onComplete, motionValue, delay]);

  const reset = useCallback(() => {
    animationRef.current?.stop();
    animationRef.current = null;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    motionValue.set(0);
    isAnimatingRef.current = false;
    isCompleteRef.current = false;
    setIsAnimating(false);
    setIsComplete(false);
  }, [motionValue]);

  useEffect(() => {
    if (
      startOnVisible &&
      isInView &&
      !isCompleteRef.current &&
      !isAnimatingRef.current
    ) {
      start();
    }
  }, [startOnVisible, isInView, start]);

  useEffect(() => {
    return () => {
      animationRef.current?.stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    value: motionValue,
    start,
    reset,
    ref: inViewRef,
    isAnimating,
    isComplete,
  };
}
