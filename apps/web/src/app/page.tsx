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


import { CardSection } from '@/app/components/ui/CardSection'
import { HeroSection } from '@/app/components/sections/HeroSection'
import { AboutSection } from '@/app/components/sections/AboutSection'
import { AccessSection } from '@/app/components/sections/AccessSection'
import { ExploreSection } from '@/app/components/sections/ExploreSection'
import { WhyNexusSection } from '@/app/components/sections/WhyNexusSection'
import { CtaSection } from '@/app/components/sections/CtaSection'

const TOTAL = 6

export default function LandingPage() {
  return (
    /*
     * The outer div height = sum of all section scroll ranges.
     *
     * Hero (index 0)      →  100vh  (sticky, no scroll range)
     * All others (×5)     →  200vh each (100vh turn + 100vh read)
     *
     * Total: 100vh + (5 × 200vh) = 1100vh
     *
     * This is what gives the browser the full scroll space
     * for all page-turn animations to play out.
     */
    <main style={{ height: '1100vh' }}>

      {/* ── Page 1 — Hero ─────────────────────────── */}
      {/*
       * index 0 — the base of the book.
       * No page-turn animation. Stays fixed as everything peels over it.
       * z-index: 1
       */}
      <CardSection index={0} totalSections={TOTAL} id="hero">
        <HeroSection />
      </CardSection>

      {/* ── Page 2 — About ────────────────────────── */}
      {/*
       * index 1 — first page that turns in.
       * bg-card so there's a visible shift from hero's bg-background.
       * z-index: 2
       */}
      <CardSection
        index={1}
        totalSections={TOTAL}
        id="about"
        className="bg-card"
      >
        <AboutSection />
      </CardSection>

      {/* ── Page 3 — Access ───────────────────────── */}
      {/*
       * index 2 — split screen section.
       * bg-background — alternates back from card.
       * z-index: 3
       */}
      <CardSection
        index={2}
        totalSections={TOTAL}
        id="access"
        className="bg-background"
      >
        <AccessSection />
      </CardSection>

      {/* ── Page 4 — Explore ──────────────────────── */}
      {/*
       * index 3 — catalog search section.
       * bg-card — alternates back.
       * z-index: 4
       */}
      <CardSection
        index={3}
        totalSections={TOTAL}
        id="explore"
        className="bg-card"
      >
        <ExploreSection />
      </CardSection>

      {/* ── Page 5 — Why NEXUS ────────────────────── */}
      {/*
       * index 4 — feature grid section.
       * bg-background — alternates.
       * z-index: 5
       */}
      <CardSection
        index={4}
        totalSections={TOTAL}
        id="why-nexus"
        className="bg-background"
      >
        <WhyNexusSection />
      </CardSection>

      {/* ── Page 6 — CTA ──────────────────────────── */}
      {/*
       * index 5 — final section, the front cover of the book.
       * bg-background — matches hero for full circle feel.
       * z-index: 6 — highest, sits on top of everything.
       */}
      <CardSection
        index={5}
        totalSections={TOTAL}
        id="cta"
        className="bg-background"
      >
        <CtaSection />
      </CardSection>

    </main>
  )
}