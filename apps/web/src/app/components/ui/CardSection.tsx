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

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface CardSectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  index: number        // position in the stack (0-based)
  totalSections: number
}

export function CardSection({
  children,
  className = '',
  id,
  index,
  totalSections,
}: CardSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  // Track scroll progress within this section's scroll range
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  })

  // Map scroll progress to vertical position
  // Section starts below screen (100%) and moves to fully covering (0%)
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ['100%', '0%']
  )

  // Subtle page curl at the leading edge — flattens as it covers
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [3, 0.5, 0]
  )

  // Shadow intensity — strongest when mid-turn, gone when fully settled
  const shadowOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 1],
    [0, 0.5, 0.15]
  )

  // First section (hero) never moves — it's the base of the book
  if (index === 0) {
    return (
      <div
        ref={sectionRef}
        id={id}
        className={`
          sticky top-0
          w-full h-screen
          overflow-hidden
          ${className}
        `}
        style={{ zIndex: index + 1 }}
      >
        {children}
      </div>
    )
  }

  return (
    // Scroll range container — this is what creates the scroll space
    // Each non-hero section needs 200vh of scroll space:
    // First 100vh = the section animating in (page turning)
    // Second 100vh = the section fully visible and sticky
    <div
      ref={sectionRef}
      style={{
        height: '200vh',
        position: 'relative',
        zIndex: index + 1,
      }}
    >
      {/* The actual visible section — sticky so it stays while parent scrolls */}
      <motion.div
        id={id}
        className={`
          sticky top-0
          w-full h-screen
          overflow-hidden
          ${className}
        `}
        style={{
          y,
          rotateX,
          transformOrigin: 'bottom center',
          transformPerspective: 1200,
          zIndex: index + 1,
          // Page edge line — subtle lighter strip at the very leading edge
          borderTop: '1px solid rgba(255,255,255,0.04)',
          // Page shadow — casts on the section below
          boxShadow: shadowOpacity.get() > 0
            ? `0 -12px 60px rgba(0,0,0,${shadowOpacity.get()})`
            : 'none',
        }}
      >
        {/* Inner grain texture — each page has its own paper feel */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {children}
      </motion.div>
    </div>
  )
}