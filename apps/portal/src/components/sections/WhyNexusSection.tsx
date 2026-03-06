'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { FeatureCard } from '@/components/ui/FeatureCard';

// Card data
const CARDS = [
  {
    n: '01',
    title: 'ISBN Auto-Fetch',
    body: 'Scan any barcode and the catalog populates itself — title, author, cover, publisher. What took 5 minutes now takes 1.',
    tag: 'Efficiency',
  },
  {
    n: '02',
    title: 'Zero Manual Fines',
    body: 'Overdue fines calculated instantly on return. Reminders sent automatically before due dates. No more phone calls. No more calendars.',
    tag: 'Automation',
  },
  {
    n: '03',
    title: 'Dead Stock Intelligence',
    body: '47% of the current collection has never been borrowed. paideon identifies it, values it, and recommends what to buy instead.',
    tag: 'Analytics',
  },
  {
    n: '04',
    title: 'Reading Gamification',
    body: 'Streaks, badges, grade-level leaderboards. Reading becomes a habit when it feels like a game. Student engagement target: 28% → 80%.',
    tag: 'Engagement',
  },
  {
    n: '05',
    title: 'School-Owned Forever',
    body: 'No vendor lock-in. No annual license. The school owns every line of code. Commercially comparable systems cost Rs. 200,000–500,000.',
    tag: 'Ownership',
  },
  {
    n: '06',
    title: 'Foundation for LMS',
    body: 'Built to evolve. Year 2 adds e-books and parent portals. Year 3 adds assignments and grading. paideon grows with the school.',
    tag: 'Future-Ready',
  },
];

export function WhypaideonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' });
  const isGridInView = useInView(gridRef, { once: true, margin: '-5% 0px' });

  return (
    <section
      ref={sectionRef}
      id="why-paideon"
      className="
        relative w-full min-h-screen
        flex flex-col items-center justify-center 
        px-[5vw] md:px-[8vw] lg:px-[10vw]
        py-20
        gap-14
        bg-background
        overflow-hidden
      "
    >
      {/* Section label  */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="font-mono text-label tracking-[0.3em] text-subtle uppercase"
      >
        04 — Why paideon
      </motion.span>

      {/* Header row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="flex items-end justify-center w-full border-b border-border pb-8 -mt-6"
      >
        {/* Heading */}
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: '110%' }}
            animate={isInView ? { y: '0%' } : {}}
            transition={{ delay: 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-display-lg font-light text-foreground leading-none"
          >
            Why <em className="italic text-muted">paideon</em>
          </motion.h2>
        </div>
      </motion.div>

      {/*  Intro line  */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="text-[14px] font-light leading-[1.9] text-muted max-w-lg -mt-6 text-center"
      >
        Every feature exists because a real problem at the school demanded it.
        None of this is speculative it is the direct response to six years of
        accumulated friction.
      </motion.p>

      {/*  Cards grid  */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px w-full bg-border"
      >
        {CARDS.map((card, i) => (
          <FeatureCard
            key={card.n}
            card={card}
            index={i}
            isGridInView={isGridInView}
          />
        ))}
      </div>
    </section>
  );
}
