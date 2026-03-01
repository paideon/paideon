// ## What's In This Hero

// **7 layers stacked on top of each other:**

// ```
// Layer 0  →  bg-background base color
// Layer 0  →  decorative grid lines (3% opacity — barely visible)
// Layer 0  →  static center gold glow (4% opacity — warmth)
// Layer 0  →  mouse-reactive ambient green light (follows cursor slowly)
// Layer 10 →  grain texture (3.5% opacity — paper feel)
// Layer 20 →  corner bracket lines (architectural detail)
// Layer 20 →  main content (letters, logo, tagline)
// Layer 20 →  scroll indicator + side labels
// ```

// **The animations in order:**

// ```
// 0ms      →  page loads
// 100ms    →  letters start falling in (staggered 100ms each)
// 800ms    →  logo mark scales in
// 900ms    →  tagline + divider line fades up with blur clear
// 1100ms   →  divider line draws itself from center outward
// 1600ms   →  scroll indicator appears
// 1800ms   →  side vertical labels appear
// ```

// **The ambient light** — a large green radial gradient that slowly follows your mouse with spring physics. It's subtle enough that people won't consciously notice it but will feel the section is responsive to them.

// **Corner brackets** — four small L-shaped lines in the corners. A small architectural detail that frames the content without adding visual noise. Common in high-end editorial design.

// **Vertical side labels** — "Est. 2026" on the left, "Library · LMS · Future" on the right. Only visible on large screens. Adds depth and dimension without cluttering mobile.

// **The scroll indicator** — a gold light that travels down the line repeatedly, like a signal pulse. Much more interesting than a static arrow.

// ---

// Also make sure your `nexus_logo.svg` is in `apps/web/public/` so the `src="/nexus_logo.svg"` path resolves correctly.


'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { MagneticLetter } from '@/app/components/ui/MagneticLetter'

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)

  // Mouse position for the ambient light that follows cursor
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring — ambient light lags behind cursor, feels like real light
  const lightX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const lightY = useSpring(mouseY, { stiffness: 40, damping: 20 })

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      // Convert to percentage so gradient position is relative to section
      mouseX.set(((e.clientX - rect.left) / rect.width) * 100)
      mouseY.set(((e.clientY - rect.top) / rect.height) * 100)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
    >

      {/* ── Layer 1: Grain texture ─────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Layer 2: Decorative grid lines ────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Layer 3: Ambient light follows mouse ──────── */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{
          width: '70vw',
          height: '70vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,124,111,0.06) 0%, transparent 65%)',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          translateX: lightX.get() - 50 + 'vw',
          translateY: lightY.get() - 50 + 'vh',
        }}
      />

      {/* ── Layer 4: Static center radial glow ────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }}
      />

      {/* ── Layer 5: Decorative corner lines ──────────── */}
      {/* Top left */}
      <div className="absolute top-8 left-8 pointer-events-none z-20">
        <div className="w-8 h-px bg-subtle opacity-40" />
        <div className="w-px h-8 bg-subtle opacity-40 mt-0" />
      </div>
      {/* Top right */}
      <div className="absolute top-8 right-8 pointer-events-none z-20 flex flex-col items-end">
        <div className="w-8 h-px bg-subtle opacity-40" />
        <div className="w-px h-8 bg-subtle opacity-40" />
      </div>
      {/* Bottom left */}
      <div className="absolute bottom-8 left-8 pointer-events-none z-20 flex flex-col justify-end">
        <div className="w-px h-8 bg-subtle opacity-40" />
        <div className="w-8 h-px bg-subtle opacity-40" />
      </div>
      {/* Bottom right */}
      <div className="absolute bottom-8 right-8 pointer-events-none z-20 flex flex-col items-end justify-end">
        <div className="w-px h-8 bg-subtle opacity-40" />
        <div className="w-8 h-px bg-subtle opacity-40" />
      </div>

      {/* ── Main content ──────────────────────────────── */}
      <div className="relative z-20 flex flex-col items-center gap-10">

        {/* Magnetic NEXUS letters */}
        <div
          className="flex select-none"
          style={{ gap: '0.02em' }}
          aria-label="NEXUS"
        >
          {'NEXUS'.split('').map((char, i) => (
            <MagneticLetter key={i} char={char} index={i} />
          ))}
        </div>

        {/* Logo + tagline */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={mounted ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ delay: 0.9, duration: 0.9, ease: 'easeOut' }}
          className="flex flex-col items-center gap-5"
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/nexus_logo.svg"
              alt="NEXUS logo"
              width={56}
              height={56}
              style={{ objectFit: 'contain' }}
            />
          </motion.div>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={mounted ? { scaleX: 1 } : {}}
            transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-12 h-px bg-border-strong origin-center"
          />

          {/* Tagline */}
          <span className="font-mono text-label tracking-[0.35em] text-subtle uppercase text-center">
            Network for Educational eXchange &amp; Universal Systems
          </span>

          {/* School name */}
          <span className="font-mono text-label tracking-[0.2em] text-subtle opacity-50 uppercase">
            C.W.W. Kannangara Central College · Mathugama
          </span>
        </motion.div>

      </div>

      {/* ── Scroll indicator ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <span className="font-mono text-label tracking-[0.3em] text-subtle uppercase">
          Scroll
        </span>
        {/* Animated scroll line */}
        <div className="relative w-px h-12 bg-border overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent via-gold to-transparent"
            style={{ height: '40%' }}
            animate={{ y: ['0%', '250%'] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 0.4,
            }}
          />
        </div>
      </motion.div>

      {/* ── Decorative side labels ────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute left-10 top-1/2 -translate-y-1/2 z-20 hidden lg:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="font-mono text-label tracking-[0.25em] text-subtle opacity-30 uppercase">
          Est. 2026
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute right-10 top-1/2 -translate-y-1/2 z-20 hidden lg:block"
        style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
      >
        <span className="font-mono text-label tracking-[0.25em] text-subtle opacity-30 uppercase">
          Library · LMS · Future
        </span>
      </motion.div>

    </section>
  )
}