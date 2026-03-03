'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

import { SpotlightPanel } from '@/components/ui/SpotlightPanel'
import { Button } from '@/components/ui/Button'

export function AccessSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  return (
    <section
      ref={sectionRef}
      id="access"
      className="
        relative w-full min-h-screen
        flex flex-col md:flex-row
        bg-background
        overflow-hidden
      "
    >

      {/* Left panel — Sign In */}
      <motion.div
        initial={{ opacity: 0, x: '-6%' }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        <SpotlightPanel className="
          flex flex-col justify-center
          px-[8vw] md:px-[6vw] lg:px-[8vw]
          py-20
          h-full min-h-[50vh] md:min-h-screen
          border-r border-border
        ">

          {/* Panel content */}
          <div className="relative z-10 flex flex-col gap-8">

            {/* Label */}
            <span className="
              font-mono text-label tracking-[0.3em] text-subtle uppercase
              flex items-center gap-3
              after:content-[''] after:flex-1 after:h-px after:bg-border
            ">
              Student & Staff Portal
            </span>

            {/* Heading */}
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: '110%' }}
                animate={isInView ? { y: '0%' } : {}}
                transition={{ delay: 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-display-md font-light leading-[1.1] text-foreground"
              >
                Your library.<br />
                <em className="italic text-muted">In your pocket.</em>
              </motion.h2>
            </div>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              className="text-[13px] font-light leading-[1.9] text-muted max-w-sm"
            >
              Search books, check availability, reserve titles, track your
              loans, and build your reading streak — all from your phone.
              No queue. No waiting.
            </motion.p>

            {/* Feature list */}
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className="flex flex-col gap-2"
            >
              {[
                'Real-time book availability',
                'Reserve & renew remotely',
                'Reading streak tracking',
                'Overdue reminders',
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 font-body text-xs text-subtle"
                >
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            >
              <Button href="/login">Sign In</Button>
            </motion.div>

          </div>

        </SpotlightPanel>
      </motion.div>

      {/* Right panel — Digital Vault */}
      <motion.div
        initial={{ opacity: 0, x: '6%' }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        <SpotlightPanel className="
          flex flex-col justify-center
          px-[8vw] md:px-[6vw] lg:px-[8vw]
          py-20
          h-full min-h-[50vh] md:min-h-screen
        ">

          {/* Panel content */}
          <div className="relative z-10 flex flex-col gap-8">

            {/* Label */}
            <span className="
              font-mono text-label tracking-[0.3em] text-subtle uppercase
              flex items-center gap-3
              after:content-[''] after:flex-1 after:h-px after:bg-border
            ">
              Digital Vault
            </span>

            {/* Heading */}
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: '110%' }}
                animate={isInView ? { y: '0%' } : {}}
                transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-display-md font-light leading-[1.1] text-foreground"
              >
                Past papers.<br />
                <em className="italic text-muted">Textbooks. Free.</em>
              </motion.h2>
            </div>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.8, ease: 'easeOut' }}
              className="text-[13px] font-light leading-[1.9] text-muted max-w-sm"
            >
              Access Ministry of Education textbooks, O/L and A/L past
              papers, and internal test papers. Searchable by year, grade,
              and subject. Available 24/7.
            </motion.p>

            {/* Feature list */}
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45, duration: 0.8, ease: 'easeOut' }}
              className="flex flex-col gap-2"
            >
              {[
                'O/L & A/L past papers',
                'Ministry of Education textbooks',
                'Internal test papers',
                'Searchable by grade & subject',
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 font-body text-xs text-subtle"
                >
                  <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55, duration: 0.8, ease: 'easeOut' }}
            >
              <Button href="/vault" variant="gold">Open Vault</Button>
            </motion.div>

          </div>

        </SpotlightPanel>
      </motion.div>

      {/*  Vertical center divider glow  */}
      <div className="
        hidden md:block
        absolute top-0 bottom-0 left-1/2 -translate-x-1/2
        w-px
        bg-gradient-to-b from-transparent via-border-strong to-transparent
        pointer-events-none z-20
      " />

    </section>
  )
}