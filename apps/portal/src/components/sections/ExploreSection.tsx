'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { CountUp } from '@/components/ui/CountUp';
import { SearchBar, type SearchFilter } from '@/components/ui/SearchBar';
import type { LibraryStats } from '@paideon/types';

// StatCard
function StatCard({
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
        flex flex-col gap-3 items-center justify-center
        group
        hover:border-border-strong
        transition-colors duration-300
      "
    >
      <span className="font-display text-[40px] font-light text-muted leading-none group-hover:text-foreground transition-colors duration-300">
        <CountUp target={target} />
      </span>

      <span className="font-mono text-label tracking-[0.2em] text-subtle uppercase leading-[1.6] whitespace-pre-line">
        {label}
      </span>

      <div className="w-4 h-px bg-border-strong group-hover:w-8 group-hover:bg-primary transition-all duration-500 mt-auto" />
    </motion.div>
  );
}

//  ExploreSection
export function ExploreSection({ stats }: { stats: LibraryStats }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' });
  const router = useRouter();

  const STATS = [
    { target: stats.books, label: 'Books in\nCatalog' },
    { target: stats.students, label: 'Students\nServed' },
    { target: '24/7', label: 'Digital\nAccess' },
    { target: 0, label: 'Manual\nProcesses' },
  ];

  const handleSearch = (query: string, filter: SearchFilter) => {
    const params = new URLSearchParams({ q: query });
    if (filter !== 'All Books') params.set('filter', filter);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section
      ref={sectionRef}
      id="explore"
      className="
        relative w-full min-h-screen
        flex flex-col items-center justify-center 
        px-[5vw] md:px-[8vw] lg:px-[10vw]
        py-20
        gap-14
        bg-card
        overflow-hidden
      "
    >
      {/* Section label */}
      <motion.span
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="font-mono text-label tracking-[0.3em] text-subtle uppercase"
      >
        03 — Explore the Catalog
      </motion.span>

      {/* Heading */}
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: '110%' }}
          animate={isInView ? { y: '0%' } : {}}
          transition={{ delay: 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-display-lg font-light text-foreground leading-[1.1]"
        >
          Find any book
          <br />
          <em className="italic text-muted">in the collection.</em>
        </motion.h2>
      </div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.25, duration: 0.9, ease: 'easeOut' }}
        className="w-full flex flex-col items-center justify-center"
      >
        <SearchBar onSearch={handleSearch} bookCount={stats.books} />
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-px w-full max-w-[740px] bg-border"
      >
        {STATS.map((stat, i) => (
          <StatCard key={i} target={stat.target} label={stat.label} index={i} />
        ))}
      </motion.div>

      {/* Bottom note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="font-mono text-label tracking-[0.15em] text-subtle opacity-40 max-w-md leading-[1.8] text-center"
      >
        Full catalog search available after sign in. Digital Vault resources are
        freely accessible without an account.
      </motion.p>
    </section>
  );
}
