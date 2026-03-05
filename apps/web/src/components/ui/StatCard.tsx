'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { CountUp } from '@/components/ui/CountUp';

export function StatCard({
  target,
  label,
  index,
}: {
  target: number | string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.08,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        bg-background
        border-t border-border
        p-8
        flex flex-col gap-3
        group
        hover:border-border-strong
        transition-colors duration-300
      "
    >
      {/* Number */}
      <span className="font-display text-[40px] font-light text-muted leading-none group-hover:text-foreground transition-colors duration-300">
        <CountUp target={target} />
      </span>

      {/* Label */}
      <span className="font-mono text-label tracking-[0.2em] text-subtle uppercase leading-[1.6] whitespace-pre-line">
        {label}
      </span>

      {/* Bottom accent line */}
      <div className="w-4 h-px bg-border-strong group-hover:w-8 group-hover:bg-primary transition-all duration-500 mt-auto" />
    </motion.div>
  );
}
