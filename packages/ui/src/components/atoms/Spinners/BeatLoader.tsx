'use client';

import clsx from 'clsx';
import { motion, useReducedMotion } from 'framer-motion';

type BeatLoaderSize = 'sm' | 'md' | 'lg';
type BeatLoaderVariant = 'green' | 'gold' | 'muted';
type BeatLoaderSpeed = 'fast' | 'normal' | 'slow';

type BeatLoaderProps = {
  size?: BeatLoaderSize;
  variant?: BeatLoaderVariant;
  speed?: BeatLoaderSpeed;
  label?: string;
  className?: string;
};

const sizeConfig: Record<
  BeatLoaderSize,
  { dot: string; gap: string; lift: number }
> = {
  sm: { dot: 'w-size-1p5 h-size-1p5', gap: 'gap-space-1', lift: 4 },
  md: { dot: 'w-size-2 h-size-2', gap: 'gap-space-1', lift: 6 },
  lg: { dot: 'w-size-3 h-size-3', gap: 'gap-space-2', lift: 8 },
};

const variantConfig: Record<BeatLoaderVariant, string> = {
  green: 'text-green-base',
  gold: 'text-gold-base',
  muted: 'text-text-muted',
};

const speedConfig: Record<BeatLoaderSpeed, number> = {
  fast: 0.4,
  normal: 0.6,
  slow: 0.9,
};

export function BeatLoader({
  size = 'md',
  variant = 'green',
  speed = 'normal',
  label = 'Loading',
  className,
}: BeatLoaderProps) {
  const reduced = useReducedMotion();
  const { dot, gap, lift } = sizeConfig[size];
  const duration = speedConfig[speed];

  return (
    <span
      role="status"
      aria-label={label}
      className={clsx(
        'inline-flex items-end',
        gap,
        variantConfig[variant],
        className,
      )}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={clsx('rounded-full bg-current shrink-0', dot)}
          animate={
            reduced
              ? { opacity: [1, 0.3, 1] }
              : {
                  y: [0, -lift, 0],
                  scale: [1, 1.15, 1],
                  opacity: [0.7, 1, 0.7],
                }
          }
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * (duration / 3),
            times: [0, 0.4, 1],
          }}
        />
      ))}
    </span>
  );
}

BeatLoader.displayName = 'BeatLoader';
