'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { RevealText } from '@/components/ui/RevealText'
import { QuoteCard } from '@/components/ui/QuoteCard'

// Quote data 
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

      {/* Vertical left accent line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[5vw] md:left-[8vw] lg:left-[10vw] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border-strong to-transparent origin-top"
      />

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
      <div className="pl-6 max-w-2xl flex flex-col gap-3">
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

      {/* Stats row */}
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
  )
}