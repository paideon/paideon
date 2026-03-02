'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

import { RevealText } from '@/components/ui/RevealText'
import { Button } from '@/components/ui/Button'


export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="
        relative w-full min-h-screen
        flex flex-col items-center justify-center
        px-[5vw] md:px-[8vw] lg:px-[10vw]
        py-20
        gap-16
        bg-card
        overflow-hidden
      "
    >

      {/* Section label */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="font-mono text-label tracking-[0.3em] text-subtle uppercase"
      >
        05 — Begin
      </motion.span>

      {/* Main heading — largest text on the page  */}
      <div className="flex flex-col items-center gap-2 text-center">
        <RevealText delay={0.05}>
          <h2 className="font-display text-display-xl font-light text-foreground leading-[1.05]">
            Knowledge
          </h2>
        </RevealText>
        <RevealText delay={0.15}>
          <h2 className="font-display text-display-xl font-light leading-[1.05] text-muted italic">
            without limits.
          </h2>
        </RevealText>
        <RevealText delay={0.25}>
          <h2 className="font-display text-display-xl font-light text-foreground leading-[1.05]">
            Learning without walls.
          </h2>
        </RevealText>
      </div>

      {/* Sub text  */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.45, duration: 0.9 }}
        className="text-[13px] font-light leading-[1.9] text-muted text-center max-w-md"
      >
        NEXUS is live at C.W.W. Kannangara Central College, Mathugama.
        Sign in with your school credentials, or explore the Digital Vault
        without an account.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55, duration: 0.9 }}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <Button href="/login" variant="gold" breathe>
          Sign In to NEXUS
        </Button>

        <Button href="/vault">
          Browse the Vault
        </Button>
      </motion.div>

      {/* Decorative horizontal rule with logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="flex items-center gap-6 w-full max-w-xs"
      >
        <div className="flex-1 h-px bg-border" />
        <img
          src="/nexus_logo.svg"
          alt="NEXUS"
          width={28}
          height={28}
          style={{ objectFit: 'contain', opacity: 1 }}
        />
        <div className="flex-1 h-px bg-border" />
      </motion.div>

      {/* Footer info  */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="flex flex-col items-center gap-2"
      >
        <span className="font-mono text-label tracking-[0.2em] text-subtle opacity-40 uppercase">
          C.W.W. Kannangara Central College · Mathugama · Est. 2026
        </span>
        <span className="font-mono text-label tracking-[0.15em] text-subtle opacity-25 uppercase">
          Built by S.C. Roshana · Cinderax · © 2026
        </span>
      </motion.div>

    </section>
  )
}