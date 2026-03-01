// ## What's In This Section

// **`SpotlightPanel`** — each panel tracks the mouse position independently. A large soft radial gradient follows the cursor with spring physics, creating the feeling of a torch illuminating the content. It fades in on hover and fades out when the mouse leaves. The gold tint is very subtle — `6% opacity` — enough to feel but not enough to see consciously.

// **`FillButton`** — on hover, a background color floods in from the left edge using `scaleX` with `originX: 0`. The fill completes in 400ms with a premium ease curve. The arrow shifts 4px right simultaneously. Two variants — `default` for Sign In (white tint) and `gold` for Open Vault (gold tint).

// **Panel entrance** — left panel slides in from `-6%` left, right panel slides in from `+6%` right simultaneously. They arrive together like two covers of a book opening.

// **Heading clip reveal** — same `overflow-hidden` + `y: 110% → 0%` technique from About section. Left panel heading reveals at `delay: 0.15`, right at `delay: 0.2` — just enough offset to feel like a stagger.

// **Feature lists** — left panel uses green dots (`bg-primary`), right panel uses gold dots (`bg-gold`). Color-coded to their respective brand roles — green for core features, gold for premium/vault content.

// **The center divider** — a gradient line that fades to transparent at top and bottom. Only visible on desktop. Reinforces the split without a hard border.

// **Decorative `∞` glyph** — bottom right of the vault panel at `2% opacity`. References the infinite availability of digital content. Same ghost element pattern as the `01` in About.

// ---

// ## Animation Sequence

// ```
// 0ms    →  both panels slide in from sides
// 150ms  →  left heading rises from clip
// 200ms  →  right heading rises from clip
// 300ms  →  left body + features fade up
// 350ms  →  right body + features fade up
// 500ms  →  left CTA button appears
// 550ms  →  right CTA button appears
// ```

'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'

// ── Spotlight panel — mouse-reactive light effect ─────────
function SpotlightPanel({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const spotX = useSpring(mouseX, { stiffness: 80, damping: 20 })
  const spotY = useSpring(mouseY, { stiffness: 80, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100)
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <motion.div
      ref={panelRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight gradient that follows mouse */}
      <motion.div
        className="absolute pointer-events-none z-0 transition-opacity duration-500"
        style={{
          width: '60%',
          paddingBottom: '60%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          top: useTransform(spotY, (v) => `${v}%`),
          left: useTransform(spotX, (v) => `${v}%`),
          transform: 'translate(-50%, -50%)',
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </motion.div>
  )
}

// ── Fill button — background floods in from left ──────────
function FillButton({
  href,
  children,
  variant = 'default',
}: {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'gold'
}) {
  const [isHovered, setIsHovered] = useState(false)

  const fillColor = variant === 'gold'
    ? 'rgba(201,168,76,0.12)'
    : 'rgba(255,255,255,0.04)'

  return (
    <a
      href={href}
      className="
        relative overflow-hidden
        inline-flex items-center gap-3
        border border-border hover:border-border-strong
        font-mono text-label tracking-[0.15em] uppercase
        text-muted hover:text-foreground
        px-9 py-4
        transition-colors duration-200
        group
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fill animation — floods from left on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: fillColor,
          originX: 0,
        }}
      />
      <span className="relative z-10">{children}</span>
      <motion.span
        className="relative z-10"
        animate={{ x: isHovered ? 4 : 0 }}
        transition={{ duration: 0.2 }}
      >
        →
      </motion.span>
    </a>
  )
}

// ── Main section ──────────────────────────────────────────
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

      {/* ── Grain ───────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Left panel — Sign In ─────────────────────── */}
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
              Student &amp; Staff Portal
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
                'Reserve &amp; renew remotely',
                'Reading streak tracking',
                'Overdue reminders',
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 font-body text-xs text-subtle"
                >
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: feature }} />
                </li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            >
              <FillButton href="/login">Sign In</FillButton>
            </motion.div>

          </div>

        </SpotlightPanel>
      </motion.div>

      {/* ── Right panel — Digital Vault ──────────────── */}
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
          bg-card
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
                'O/L &amp; A/L past papers',
                'Ministry of Education textbooks',
                'Internal test papers',
                'Searchable by grade &amp; subject',
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 font-body text-xs text-subtle"
                >
                  <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: feature }} />
                </li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55, duration: 0.8, ease: 'easeOut' }}
            >
              <FillButton href="/vault" variant="gold">Open Vault</FillButton>
            </motion.div>

          </div>

          {/* Decorative glyph */}
          <span
            className="absolute bottom-10 right-[6vw] font-display text-[160px] font-light text-foreground opacity-[0.02] leading-none select-none pointer-events-none"
            aria-hidden="true"
          >
            ∞
          </span>

        </SpotlightPanel>
      </motion.div>

      {/* ── Vertical center divider glow ─────────────── */}
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