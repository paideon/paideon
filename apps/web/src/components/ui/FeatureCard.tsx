'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const WAVE_DELAYS = [0, 0.1, 0.2, 0.1, 0.2, 0.3];

interface Cards {
  n: string;
  title: string;
  body: string;
  tag: string;
}

export function FeatureCard({
  card,
  index,
  isGridInView,
}: {
  card: Cards;
  index: number;
  isGridInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={isGridInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: WAVE_DELAYS[index],
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative bg-card border border-border p-10 flex flex-col gap-4 group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/*  Gold corner accent — draws on hover  */}
      {/* Top-left corner */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-none"
        initial={false}
      >
        {/* Horizontal line */}
        <motion.div
          className="absolute top-0 left-0 h-px bg-gold origin-left"
          animate={{ scaleX: isHovered ? 1 : 0, width: 40 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 40 }}
        />
        {/* Vertical line */}
        <motion.div
          className="absolute top-0 left-0 w-px bg-gold origin-top"
          animate={{ scaleY: isHovered ? 1 : 0, height: 40 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          style={{ height: 40 }}
        />
      </motion.div>

      {/* Bottom-right corner */}
      <motion.div
        className="absolute bottom-0 right-0 pointer-events-none"
        initial={false}
      >
        {/* Horizontal line */}
        <motion.div
          className="absolute bottom-0 right-0 h-px bg-gold origin-right"
          animate={{ scaleX: isHovered ? 1 : 0, width: 40 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 40 }}
        />
        {/* Vertical line */}
        <motion.div
          className="absolute bottom-0 right-0 w-px bg-gold origin-bottom"
          animate={{ scaleY: isHovered ? 1 : 0, height: 40 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          style={{ height: 40 }}
        />
      </motion.div>

      {/*  Subtle hover background shift  */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(201,168,76,0.03) 0%, transparent 70%)',
        }}
      />

      {/*  Card content  */}
      <span className="font-mono text-label tracking-[0.2em] text-subtle group-hover:text-muted transition-colors duration-300 relative z-10">
        {card.n}
      </span>

      <h3 className="font-display text-[22px] font-light text-muted group-hover:text-foreground transition-colors duration-300 leading-[1.2] relative z-10">
        {card.title}
      </h3>

      <p className="text-[12px] font-light leading-[1.85] text-subtle group-hover:text-muted transition-colors duration-300 flex-1 relative z-10">
        {card.body}
      </p>

      {/* Tag */}
      <span className="font-mono text-label tracking-[0.15em] text-subtle uppercase mt-auto relative z-10 group-hover:text-gold transition-colors duration-500">
        {card.tag}
      </span>
    </motion.div>
  );
}
