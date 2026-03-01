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