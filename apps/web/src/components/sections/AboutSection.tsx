'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { RevealText } from '@/components/ui/RevealText';
import { QuoteCard } from '@/components/ui/QuoteCard';
import { CountUp } from '@/components/ui/CountUp';
import type { LibraryStats } from '@paideon/types';

// Quote data
const QUOTES = [
  {
    text: '"A reader lives a thousand lives before he dies. The man who never reads lives only one."',
    author: 'George R.R. Martin',
  },
  {
    text: '"The world belongs to those who read."',
    author: 'Rick Holland',
  },
  {
    text: '"A book is a dream that you hold in your hands."',
    author: 'Neil Gaiman',
  },
];

export function AboutSection({ stats }: { stats: LibraryStats }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' });

  const STATS = [
    { target: stats.students, label: 'Students' },
    { target: stats.teachers, label: 'Teachers' },
    { target: stats.staff, label: 'Staff' },
    { target: stats.books, label: 'Books' },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="
        relative w-full min-h-screen
        flex flex-col items-center justify-center
        py-10
        px-10
        gap-16
        bg-card
        overflow-hidden
      "
    >
      {/* Section label */}
      <motion.span
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="font-mono text-label tracking-[0.3em] text-subtle uppercase pl-6"
      >
        01 — About
      </motion.span>

      {/* Main heading */}
      <div className="pl-6 max-w-2xl flex flex-col gap-3 items-center text-center">
        <RevealText>
          <h2 className="font-display text-display-md font-light leading-[1.1] text-foreground">
            A library built for the
          </h2>
        </RevealText>
        <RevealText>
          <h2 className="font-display text-display-md font-light leading-[1.1] text-foreground">
            <em className="italic text-muted">way students actually live.</em>
          </h2>
        </RevealText>
      </div>

      {/* Body text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
        className="pl-6 max-w-xl"
      >
        <p className="text-[15px] font-light leading-[1.9] text-muted text-center">
          paideon replaces a 2012-era spreadsheet system at C.W.W. Kannangara
          Central College with a mobile-first, intelligent library platform
          serving{' '}
          <span className="text-foreground font-normal">{stats.students}</span>{' '}
          students,{' '}
          <span className="text-foreground font-normal">{stats.teachers}</span>{' '}
          teachers, and{' '}
          <span className="text-foreground font-normal">{stats.staff}</span>{' '}
          staff. Every workflow automated. Every book discoverable. Every rupee
          justified with data.
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.45, duration: 0.9, ease: 'easeOut' }}
        className="pl-6 flex gap-12"
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="font-display text-3xl font-light text-foreground leading-none">
              <CountUp target={stat.target} />
            </span>
            <span className="font-mono text-label tracking-[0.2em] text-subtle uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Quote cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="pl-6 flex flex-col md:flex-row gap-px w-full"
      >
        {QUOTES.map((q, i) => (
          <QuoteCard key={i} text={q.text} author={q.author} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
