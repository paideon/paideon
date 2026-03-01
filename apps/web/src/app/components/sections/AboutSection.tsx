// ## What's In This Section

// **The `RevealHeading` component** — each line of the heading is individually masked. The text sits inside an `overflow-hidden` container and slides up from below the clip boundary. The effect is like a theater curtain rising line by line. Each line reveals independently giving the heading a sense of being written in real time.

// **The vertical accent line** — draws itself from top to bottom using `scaleY` with `origin-top`. It grows downward as the section enters, like ink being drawn down a page.

// **Quote cards — the dealing animation** — each card starts slightly rotated and scaled down, then settles flat. The rotation alternates direction — card 0 tilts left, card 1 tilts right, card 2 tilts left. Like cards being placed on a table from a hand. They arrive with a 120ms stagger.

// **On hover each quote card** — the divider line under the author name extends from `w-6` to `w-10`. Small detail, but it makes hovering feel rewarding.

// **Stats row** — four key numbers displayed in display font. These are static here since they're fixed institutional numbers, not things that need to animate with CountUp.

// **Decorative large `01`** — faintly visible in the bottom right corner at 1.5% opacity. A ghost number that adds depth without competing with content. Each section will have its own ghost number.

// ---

// ## Animation Sequence When Section Enters

// ```
// 0ms    →  vertical line starts drawing down
// 0ms    →  section label slides in from left
// 200ms  →  heading line 1 rises from clip
// 300ms  →  heading line 2 rises from clip
// 300ms  →  body paragraph fades up
// 450ms  →  stats row fades up
// 500ms  →  quote cards container appears
// 500ms  →  card 1 deals in
// 620ms  →  card 2 deals in
// 740ms  →  card 3 deals in
// ```

'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Quote data ─────────────────────────────────────────────
const QUOTES = [
  {
    text: '"A library is not a luxury but one of the necessities of life."',
    author: 'Henry Ward Beecher',
  },
  {
    text: '"The library is the temple of learning, and learning has liberated more people than all the wars in history."',
    author: 'Carl T. Rowan',
  },
  {
    text: '"Today a reader, tomorrow a leader."',
    author: 'Margaret Fuller',
  },
]

// ── Animated heading — words reveal from behind clip ──────
function RevealHeading({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={isInView ? { y: '0%', opacity: 1 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// ── Quote card — deals in like a playing card ─────────────
function QuoteCard({
  text,
  author,
  index,
}: {
  text: string
  author: string
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })

  // Diagonal wave — cards 0, then 1, then 2
  // But with overlap: 0 starts at 0ms, 1 at 120ms, 2 at 240ms
  const delay = index * 0.12

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 40,
        rotate: index % 2 === 0 ? -1.5 : 1.5,
        scale: 0.96,
      }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
          : {}
      }
      transition={{
        delay,
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        flex-1
        bg-background
        border border-border
        hover:border-border-strong
        hover:bg-card
        p-7
        flex flex-col gap-4
        transition-colors duration-300
        group
        cursor-default
      "
    >
      {/* Quote mark */}
      <span
        className="font-display text-5xl font-light leading-none text-subtle opacity-30 select-none"
        aria-hidden="true"
      >
        "
      </span>

      {/* Quote text */}
      <p className="font-display text-[17px] italic font-light leading-[1.6] text-subtle group-hover:text-muted transition-colors duration-300 flex-1">
        {text.replace(/^"|"$/g, '')}
      </p>

      {/* Divider */}
      <div className="w-6 h-px bg-border-strong group-hover:w-10 transition-all duration-500" />

      {/* Author */}
      <span className="font-mono text-label tracking-[0.2em] text-subtle uppercase">
        {author}
      </span>
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  return (
    <section
      ref={sectionRef}
      id="about"
      className="
        relative w-full min-h-screen
        flex flex-col items-start justify-center
        px-[5vw] md:px-[8vw] lg:px-[10vw]
        py-20
        gap-16
        bg-card
        overflow-hidden
      "
    >

      {/* ── Grain texture ───────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Vertical left accent line ────────────────── */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[5vw] md:left-[8vw] lg:left-[10vw] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border-strong to-transparent origin-top"
      />

      {/* ── Section label ────────────────────────────── */}
      <motion.span
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="font-mono text-label tracking-[0.3em] text-subtle uppercase pl-6"
      >
        01 — About
      </motion.span>

      {/* ── Main heading ─────────────────────────────── */}
      <div className="pl-6 max-w-2xl flex flex-col gap-3">
        <RevealHeading>
          <h2 className="font-display text-display-md font-light leading-[1.1] text-foreground">
            A library built for the
          </h2>
        </RevealHeading>
        <RevealHeading>
          <h2 className="font-display text-display-md font-light leading-[1.1] text-foreground">
            <em className="italic text-muted">way students actually live.</em>
          </h2>
        </RevealHeading>
      </div>

      {/* ── Body text ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
        className="pl-6 max-w-xl"
      >
        <p className="text-[15px] font-light leading-[1.9] text-muted">
          NEXUS replaces a 2012-era spreadsheet system at C.W.W. Kannangara
          Central College with a mobile-first, intelligent library platform —
          serving{' '}
          <span className="text-foreground">4,198 students</span>,{' '}
          <span className="text-foreground">188 teachers</span>, and{' '}
          <span className="text-foreground">77 staff</span>.
          Every workflow automated. Every book discoverable. Every rupee
          justified with data.
        </p>
      </motion.div>

      {/* ── Stats row ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.45, duration: 0.9, ease: 'easeOut' }}
        className="pl-6 flex gap-12"
      >
        {[
          { value: '4,198', label: 'Students' },
          { value: '188', label: 'Teachers' },
          { value: '77', label: 'Staff' },
          { value: '8,500+', label: 'Books' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="font-display text-3xl font-light text-foreground leading-none">
              {stat.value}
            </span>
            <span className="font-mono text-label tracking-[0.2em] text-subtle uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── Quote cards ──────────────────────────────── */}
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

      {/* ── Decorative large number ───────────────────── */}
      <span
        className="absolute right-[6vw] bottom-8 font-display text-[180px] font-light leading-none select-none pointer-events-none text-foreground opacity-[0.015]"
        aria-hidden="true"
      >
        01
      </span>

    </section>
  )
}