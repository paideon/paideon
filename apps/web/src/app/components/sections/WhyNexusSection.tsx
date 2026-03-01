// What's In This Section
// Diagonal wave arrival — the 6 cards don't arrive linearly. The delay map is:
// [0, 0.1, 0.2, 0.1, 0.2, 0.3]

// Card layout:   01  02  03
//                04  05  06

// Delay:         0   0.1 0.2
//                0.1 0.2 0.3
// Cards 01 and 04 share 0 and 0.1 — they arrive almost together forming a diagonal front. The wave travels from top-left to bottom-right like light hitting a surface at an angle.
// Gold corner accent on hover — two L-shaped gold lines draw themselves in the top-left and bottom-right corners simultaneously. The horizontal line draws first (scaleX), then 50ms later the vertical line draws down/up (scaleY). Gives each card a premium framing on hover that feels intentional.
// Tag color shift — each card has a category tag at the bottom. At rest it's text-subtle. On hover it transitions to text-gold. The tag becomes the gold detail that ties the hover state together.
// Header row with divider — the section heading and "06 reasons" counter sit on either end of a bottom-bordered row. The heading rises from a clip, the counter slides in from the right. The horizontal rule below them acts as a stage.
// Same gap-px + bg-border trick as ExploreSection stats — creates hairline dividers between all cards without individual border styling.

'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Card data ─────────────────────────────────────────────
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
    body: '47% of the current collection has never been borrowed. NEXUS identifies it, values it, and recommends what to buy instead.',
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
    body: 'Built to evolve. Year 2 adds e-books and parent portals. Year 3 adds assignments and grading. NEXUS grows with the school.',
    tag: 'Future-Ready',
  },
]

// ── Diagonal wave delay map ────────────────────────────────
// Grid is 3 columns × 2 rows
// Wave travels diagonally: 0 → (1,3) → (2,4) → 5
const WAVE_DELAYS = [0, 0.1, 0.2, 0.1, 0.2, 0.3]

// ── Feature card with gold corner accent ──────────────────
function FeatureCard({
  card,
  index,
  isGridInView,
}: {
  card: (typeof CARDS)[0]
  index: number
  isGridInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

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

      {/* ── Gold corner accent — draws on hover ─────── */}
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

      {/* ── Subtle hover background shift ───────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(201,168,76,0.03) 0%, transparent 70%)',
        }}
      />

      {/* ── Card content ─────────────────────────────── */}
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
  )
}

// ── Main section ──────────────────────────────────────────
export function WhyNexusSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const isGridInView = useInView(gridRef, { once: true, margin: '-5% 0px' })

  return (
    <section
      ref={sectionRef}
      id="why-nexus"
      className="
        relative w-full min-h-screen
        flex flex-col items-start justify-center
        px-[5vw] md:px-[8vw] lg:px-[10vw]
        py-20
        gap-14
        bg-background
        overflow-hidden
      "
    >

      {/* ── Grain ───────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Header row ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="flex items-end justify-between w-full border-b border-border pb-8"
      >
        {/* Heading */}
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: '110%' }}
            animate={isInView ? { y: '0%' } : {}}
            transition={{ delay: 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-display-lg font-light text-foreground leading-none"
          >
            Why{' '}
            <em className="italic text-muted">NEXUS</em>
          </motion.h2>
        </div>

        {/* Counter */}
        <motion.span
          initial={{ opacity: 0, x: 16 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-mono text-label tracking-[0.2em] text-subtle uppercase pb-1"
        >
          06 reasons
        </motion.span>
      </motion.div>

      {/* ── Intro line ───────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="text-[14px] font-light leading-[1.9] text-muted max-w-lg -mt-6"
      >
        Every feature exists because a real problem at the school demanded it.
        None of this is speculative — it is the direct response to six years
        of accumulated friction.
      </motion.p>

      {/* ── Cards grid ───────────────────────────────── */}
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

      {/* ── Section label ────────────────────────────── */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="font-mono text-label tracking-[0.3em] text-subtle uppercase"
      >
        04 — Why NEXUS
      </motion.span>

      {/* ── Decorative large number ───────────────────── */}
      <span
        className="absolute right-[6vw] bottom-8 font-display text-[180px] font-light leading-none select-none pointer-events-none text-foreground opacity-[0.015]"
        aria-hidden="true"
      >
        04
      </span>

    </section>
  )
}