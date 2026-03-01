// ## How It Works

// **The scroll range container (`200vh`)** — each section except the hero gets a `200vh` tall invisible container. The first `100vh` is consumed by the page turning animation. The second `100vh` keeps the section sticky and visible while the user reads it.

// **The hero (`index === 0`)** — never moves. It's `sticky top-0` and stays as the base layer. Every other section peels over it.

// **`translateY` 100% → 0%** — the incoming section starts completely below the screen and slides up to fully cover the previous one. On scroll up it reverses exactly.

// **`rotateX` 3° → 0°** — the subtle curl at the start that flattens as the page settles. This is the book feel.

// **`borderTop`** — a 1px barely visible line at the leading edge, like the edge of a physical page.

// **`boxShadow`** — casts downward onto the section below, like a page lifted from a book.

// ---

// ## How to Use It in `page.tsx`

// ```tsx
// <main>
//   <CardSection index={0} totalSections={6} id="hero">
//     <HeroSection />
//   </CardSection>

//   <CardSection index={1} totalSections={6} id="about" className="bg-background">
//     <AboutSection />
//   </CardSection>

//   <CardSection index={2} totalSections={6} id="access" className="bg-card">
//     <AccessSection />
//   </CardSection>

//   {/* ...and so on */}
// </main>
// ```


'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

interface CardSectionProps {
  children: React.ReactNode
  index: number
  totalSections: number
  id?: string
  className?: string
}

export function CardSection({
  children,
  index,
  totalSections,
  id,
  className = '',
}: CardSectionProps) {

  // ── Global scroll progress (0 at very top, 1 at very bottom) ──
  const { scrollYProgress } = useScroll()

  const isLast = index === totalSections - 1

  // ── Z-index stacking ──────────────────────────────────────────
  // First page is on TOP (highest z-index) — it's the page you're
  // currently reading. Each page turn removes it, revealing the one below.
  // Page 0 → z: 6, Page 1 → z: 5, ..., Page 5 → z: 1
  const zIndex = totalSections - index

  // ── Scroll range for this page ────────────────────────────────
  // Total scroll is divided equally between all sections.
  // Each section's turn happens in 1/totalSections of the full scroll.
  // Page 0 turns: scroll 0.00 → 0.17
  // Page 1 turns: scroll 0.17 → 0.33
  // Page 2 turns: scroll 0.33 → 0.50
  // ...and so on
  const rangeStart = index / totalSections
  const rangeEnd   = (index + 1) / totalSections
  const rangeMid   = (rangeStart + rangeEnd) / 2

  // ── Core rotation ─────────────────────────────────────────────
  // rotateY: 0 = page lying flat (fully visible)
  //         -90 = page is edge-on (paper-thin sliver)
  //        -180 = page fully turned over (backface hidden = invisible)
  // The page rotates around its LEFT EDGE (the spine)
  // and sweeps to the left — exactly like a real book page.
  const rotateY = useTransform(
    scrollYProgress,
    [rangeStart, rangeEnd],
    [0, -180]
  )

  // ── Z lift during turn ────────────────────────────────────────
  // At the midpoint of the turn, the page lifts slightly toward
  // the viewer — like how a real page bulges away from the book
  // when you're mid-turn.
  const translateZ = useTransform(
    scrollYProgress,
    [rangeStart, rangeMid, rangeEnd],
    [0, 80, 0]
  )

  // ── Shadow opacity ────────────────────────────────────────────
  // Simulates the shadow the turning page casts on itself.
  // Peaks when the page is at -90deg (edge-on) — the most curved point.
  const shadowOpacity = useTransform(
    scrollYProgress,
    [
      rangeStart,
      rangeStart + (rangeEnd - rangeStart) * 0.25,
      rangeStart + (rangeEnd - rangeStart) * 0.75,
      rangeEnd,
    ],
    [0, 0.88, 0.88, 0]
  )

  // ── Spine highlight opacity ───────────────────────────────────
  // A bright line at the LEFT edge during the turn —
  // simulates light catching the paper at the fold/spine.
  const spineOpacity = useTransform(
    scrollYProgress,
    [rangeStart, rangeStart + 0.015, rangeEnd - 0.015, rangeEnd],
    [0, 1, 1, 0]
  )

  // ── Last page ─────────────────────────────────────────────────
  // The final section is never turned — it's the back cover.
  // It's revealed when the second-to-last page turns away.
  if (isLast) {
    return (
      <div
        id={id}
        className={`absolute inset-0 overflow-hidden ${className}`}
        style={{ zIndex }}
      >
        {children}
      </div>
    )
  }

  return (
    // ── Perspective wrapper ──────────────────────────────────────
    // Perspective must be on the PARENT of the rotating element.
    // perspectiveOrigin at 75% center pushes the vanishing point
    // toward the right — enhances the 3D depth of the turn.
    <div
      className="absolute inset-0"
      style={{
        zIndex,
        perspective: '2200px',
        perspectiveOrigin: '75% center',
      }}
    >
      {/* ── The actual turning page ─────────────────────────── */}
      {/* transformOrigin: 'left center' — the page rotates around
          its left edge (the spine). This is the key difference from
          a generic flip. The right edge lifts first, sweeps across,
          and disappears. Exactly like a real book page. */}
      <motion.div
        id={id}
        className={`relative w-full h-full overflow-hidden ${className}`}
        style={{
          rotateY,
          translateZ,
          transformOrigin: 'left center',
          // backfaceVisibility hidden: once rotated past -90deg the
          // back face is invisible. At -180deg the page is completely
          // gone — revealing the next page sitting underneath.
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >

        {/* Page content */}
        {children}

        {/* ── Shadow gradient ─────────────────────────────────── */}
        {/* Darkest on the right (the lifting edge),
            fading to transparent on the left (near the spine).
            This gradient is what sells the curl — it simulates
            the concave shadow on the underside of a bending page. */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: shadowOpacity,
            background:
              'linear-gradient(to left, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.6) 15%, rgba(0,0,0,0.2) 40%, transparent 65%)',
            zIndex: 100,
          }}
        />

        {/* ── Spine highlight ─────────────────────────────────── */}
        {/* A soft bright vertical line at the left edge during the
            turn — simulates light catching the paper at the fold. */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 pointer-events-none"
          style={{
            width: '4px',
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.15) 80%, transparent 100%)',
            opacity: spineOpacity,
            zIndex: 101,
          }}
        />

      </motion.div>
    </div>
  )
}