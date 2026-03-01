// ## How The Math Works

// ```
// Hero           →  100vh   (sticky, no scroll range needed)
// About          →  200vh   (100vh to turn in + 100vh to read)
// Access         →  200vh
// Explore        →  200vh
// Why NEXUS      →  200vh
// CTA            →  200vh
// ─────────────────────────
// Total          →  1100vh  ← this is the outer main height
// ```

// The browser needs to know the total scroll height upfront. `1100vh` gives it exactly that — 11 full screen lengths of scroll space.

// ---

// ## Background Color Alternation

// ```
// Hero        bg-background   #0e1117  ← dark base
// About       bg-card         #161b27  ← slightly lighter
// Access      bg-background   #0e1117  ← back to dark
// Explore     bg-card         #161b27  ← lighter again
// Why NEXUS   bg-background   #0e1117  ← dark
// CTA         bg-background   #0e1117  ← matches hero
// ```

// The alternation means each new page turning in has a visually distinct surface — you can see the edge of the new page arriving because it's a different shade. Without this alternation all pages would be the same color and the effect would be invisible.


import { CardSection } from '@/components/ui/CardSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { AccessSection } from '@/components/sections/AccessSection'
import { ExploreSection } from '@/components/sections/ExploreSection'
import { WhyNexusSection } from '@/components/sections/WhyNexusSection'
import { CtaSection } from '@/components/sections/CtaSection'

const TOTAL = 6

export default function LandingPage() {
  return (
    /*
     * ── How the book page turn works ──────────────────────────
     *
     * The outer <main> has height = TOTAL × 100vh = 600vh.
     * This gives the browser the full scroll space.
     *
     * Inside is ONE sticky container that takes up exactly 100vh
     * and sticks to the top for the entire 600vh of scrolling.
     * The user "scrolls" but the viewport never actually moves —
     * the sticky container stays fixed in place.
     *
     * Inside the sticky container, ALL 6 pages are stacked on top
     * of each other using position: absolute, inset: 0.
     *
     * Z-index stacking (first page on top):
     *   Hero    → z: 6  (starts on top, first to turn)
     *   About   → z: 5  (revealed when Hero turns away)
     *   Access  → z: 4
     *   Explore → z: 3
     *   Why     → z: 2
     *   CTA     → z: 1  (bottom of the stack, never turns)
     *
     * Scroll progress 0→1 is divided into 6 equal ranges.
     * Each page turns (rotateY 0 → -180) in its own range.
     * When rotateY hits -180 the page is invisible (backface hidden)
     * and the page below is revealed.
     *
     * This is exactly what happens when you turn a real book page:
     * - The current page rotates around the spine (left edge)
     * - It sweeps right-to-left across the screen
     * - It disappears, revealing the next page underneath
     * - Scroll back up = pages turn back in reverse
     * ─────────────────────────────────────────────────────────
     */
    <main style={{ height: `${TOTAL * 100}vh` }}>

      {/*
       * The sticky book viewport.
       * position: sticky keeps it pinned to top: 0 for the
       * entire 600vh scroll range. overflow: hidden clips
       * any page content that might bleed outside.
       */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >

        {/* ── Page 1 — Hero ──────────────────────────────── */}
        {/* z: 6 — on top of everything. First page to turn.
            bg-background (#0e1117) — the darkest surface. */}
        <CardSection
          index={0}
          totalSections={TOTAL}
          id="hero"
          className="bg-background"
        >
          <HeroSection />
        </CardSection>

        {/* ── Page 2 — About ─────────────────────────────── */}
        {/* z: 5 — revealed when Hero turns away.
            bg-card (#161b27) — slightly lighter than hero,
            so the page turn reveals a visibly different surface. */}
        <CardSection
          index={1}
          totalSections={TOTAL}
          id="about"
          className="bg-card"
        >
          <AboutSection />
        </CardSection>

        {/* ── Page 3 — Access ────────────────────────────── */}
        {/* z: 4 — split screen section.
            bg-background — alternates back to dark. */}
        <CardSection
          index={2}
          totalSections={TOTAL}
          id="access"
          className="bg-background"
        >
          <AccessSection />
        </CardSection>

        {/* ── Page 4 — Explore ───────────────────────────── */}
        {/* z: 3 — catalog search section.
            bg-card — alternates lighter again. */}
        <CardSection
          index={3}
          totalSections={TOTAL}
          id="explore"
          className="bg-card"
        >
          <ExploreSection />
        </CardSection>

        {/* ── Page 5 — Why NEXUS ─────────────────────────── */}
        {/* z: 2 — feature grid section.
            bg-background — alternates back to dark. */}
        <CardSection
          index={4}
          totalSections={TOTAL}
          id="why-nexus"
          className="bg-background"
        >
          <WhyNexusSection />
        </CardSection>

        {/* ── Page 6 — CTA ───────────────────────────────── */}
        {/* z: 1 — the back cover. Lowest z-index.
            Never turns — just gets revealed when Why NEXUS turns.
            bg-background — matches Hero for full circle feel. */}
        <CardSection
          index={5}
          totalSections={TOTAL}
          id="cta"
          className="bg-background"
        >
          <CtaSection />
        </CardSection>

      </div>
    </main>
  )
}