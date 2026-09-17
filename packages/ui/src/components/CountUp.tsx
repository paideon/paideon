"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  className?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = false,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const value = useMotionValue(from);
  const spring = useSpring(value, { damping: 18, stiffness: 80 });
  const display = useTransform(spring, (current) => {
    const formatted = current.toFixed(decimals);
    const withSeparator = separator
      ? Number(formatted).toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : formatted;

    return `${prefix}${withSeparator}${suffix}`;
  });

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      value.set(from + (to - from) * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [duration, from, isInView, to, value]);

  return (
    <motion.span ref={ref} className={className}>
      {display.get()}
    </motion.span>
  );
}
