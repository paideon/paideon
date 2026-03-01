// ## What's In This Section

// **Three-line split reveal** — the largest text on the entire landing page. Three lines of the heading arrive sequentially with 100ms gaps, each rising from behind its own invisible clip. The middle line is italic and `text-muted` — "without limits." — creating a visual rhythm of dark/light/dark across the three lines.

// **The breathing gold button** — "Sign In to NEXUS" pulses with a very slow `scale: [1, 1.015, 1]` on a 2.8 second loop when idle. The moment you hover it, the breathing stops and the fill flood takes over. The eye is drawn to it without it being aggressive.

// **The fill flood on the gold button** — hover floods the gold background in from the left edge. When it fills, the text color transitions from `text-gold` to `text-background` — dark text on gold background. A complete color inversion that feels premium and complete.

// **The center divider with logo** — two hairline rules flanking the dimmed logo mark at 30% opacity. Closes the main content area before the footer info, like a colophon in a printed book.

// **Corner brackets** — same as the hero section. The page opens with corner brackets, it closes with corner brackets. The symmetry makes the whole landing page feel like a contained, considered document.

// **Footer info** — school name, year, and attribution in mono type at 25–40% opacity. Present but invisible unless you're looking for it.

// ---

'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Split line reveal heading ─────────────────────────────
// Each line slides up from behind an invisible clip — theater curtain effect
function SplitLine({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={isInView ? { y: '0%', opacity: 1 } : {}}
        transition={{ delay, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// ── Breathing CTA button ──────────────────────────────────
function CtaButton({
  href,
  children,
  variant = 'default',
  breathe = false,
}: {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'gold'
  breathe?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const isGold = variant === 'gold'

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Breathing — very slow scale pulse when idle, stops when hovered
      animate={
        breathe && !isHovered
          ? { scale: [1, 1.015, 1] }
          : { scale: 1 }
      }
      transition={
        breathe && !isHovered
          ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.2 }
      }
      className={`
        relative overflow-hidden
        inline-flex items-center gap-4
        font-mono text-label tracking-[0.18em] uppercase
        px-12 py-5
        transition-colors duration-200
        group
        ${
          isGold
            ? 'bg-gold-muted border border-gold/30 hover:border-gold text-gold hover:bg-gold hover:text-background'
            : 'bg-card border border-border hover:border-border-strong text-muted hover:text-foreground'
        }
      `}
    >
      {/* Fill flood on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: isGold
            ? 'rgba(201,168,76,1)'
            : 'rgba(255,255,255,0.04)',
          originX: 0,
          zIndex: 0,
        }}
      />

      <span className="relative z-10 transition-colors duration-200">
        {children}
      </span>

      <motion.span
        className="relative z-10"
        animate={{ x: isHovered ? 5 : 0 }}
        transition={{ duration: 0.2 }}
      >
        →
      </motion.span>
    </motion.a>
  )
}

// ── Main section ──────────────────────────────────────────
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
        bg-background
        overflow-hidden
      "
    >

      {/* ── Grain ───────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Large centered radial glow ───────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }}
      />

      {/* ── Grid lines — more prominent in CTA ──────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* ── Section label ────────────────────────────── */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="font-mono text-label tracking-[0.3em] text-subtle uppercase"
      >
        05 — Begin
      </motion.span>

      {/* ── Main heading — largest text on the page ──── */}
      <div className="flex flex-col items-center gap-2 text-center">
        <SplitLine delay={0.05}>
          <h2 className="font-display text-display-xl font-light text-foreground leading-[1.05]">
            Knowledge
          </h2>
        </SplitLine>
        <SplitLine delay={0.15}>
          <h2 className="font-display text-display-xl font-light leading-[1.05] text-muted italic">
            without limits.
          </h2>
        </SplitLine>
        <SplitLine delay={0.25}>
          <h2 className="font-display text-display-xl font-light text-foreground leading-[1.05]">
            Learning without walls.
          </h2>
        </SplitLine>
      </div>

      {/* ── Sub text ─────────────────────────────────── */}
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

      {/* ── Buttons ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55, duration: 0.9 }}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <CtaButton href="/login" variant="gold" breathe>
          Sign In to NEXUS
        </CtaButton>

        <CtaButton href="/vault">
          Browse the Vault
        </CtaButton>
      </motion.div>

      {/* ── Decorative horizontal rule with logo ─────── */}
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
          style={{ objectFit: 'contain', opacity: 0.3 }}
        />
        <div className="flex-1 h-px bg-border" />
      </motion.div>

      {/* ── Footer info ──────────────────────────────── */}
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

      {/* ── Corner brackets ──────────────────────────── */}
      {/* Top left */}
      <div className="absolute top-10 left-10 pointer-events-none">
        <div className="w-10 h-px bg-subtle opacity-20" />
        <div className="w-px h-10 bg-subtle opacity-20" />
      </div>
      {/* Top right */}
      <div className="absolute top-10 right-10 pointer-events-none flex flex-col items-end">
        <div className="w-10 h-px bg-subtle opacity-20" />
        <div className="w-px h-10 bg-subtle opacity-20" />
      </div>
      {/* Bottom left */}
      <div className="absolute bottom-10 left-10 pointer-events-none flex flex-col justify-end">
        <div className="w-px h-10 bg-subtle opacity-20" />
        <div className="w-10 h-px bg-subtle opacity-20" />
      </div>
      {/* Bottom right */}
      <div className="absolute bottom-10 right-10 pointer-events-none flex flex-col items-end justify-end">
        <div className="w-px h-10 bg-subtle opacity-20" />
        <div className="w-10 h-px bg-subtle opacity-20" />
      </div>

    </section>
  )
}