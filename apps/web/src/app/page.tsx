import { CardSection } from '@/components/ui/CardSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { AccessSection } from '@/components/sections/AccessSection'
import { ExploreSection } from '@/components/sections/ExploreSection'
import { WhyNexusSection } from '@/components/sections/WhyNexusSection'
import { CtaSection } from '@/components/sections/CtaSection'
import { LIBRARY_STATS_FALLBACK, type LibraryStats } from '@nexus/types'

const TOTAL = 6

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getLibraryStats(): Promise<LibraryStats> {
  // PHASE 2 — uncomment this block and delete the fallback return below:
  //
  // try {
  //   const res = await fetch(`${process.env.API_URL}/stats`, {
  //     next: { revalidate: 3600 },
  //   })
  //   if (!res.ok) throw new Error('Stats fetch failed')
  //   return res.json()
  // } catch {
  //   return LIBRARY_STATS_FALLBACK
  // }

  return LIBRARY_STATS_FALLBACK
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function LandingPage() {
  const stats = await getLibraryStats()

  return (
    <main>

      {/* ── Hero ─────────────────────────────────────────── */}
      <CardSection index={0} totalSections={TOTAL} id="hero" className="bg-background">
        <HeroSection />
      </CardSection>

      {/* ── About ────────────────────────────────────────── */}
      <CardSection index={1} totalSections={TOTAL} id="about" className="bg-card">
        <AboutSection stats={stats} />
      </CardSection>

      {/* ── Access ───────────────────────────────────────── */}
      <CardSection index={2} totalSections={TOTAL} id="access" className="bg-background">
        <AccessSection />
      </CardSection>

      {/* ── Explore ──────────────────────────────────────── */}
      <CardSection index={3} totalSections={TOTAL} id="explore" className="bg-card">
        <ExploreSection stats={stats} />
      </CardSection>

      {/* ── Why NEXUS ────────────────────────────────────── */}
      <CardSection index={4} totalSections={TOTAL} id="why-nexus" className="bg-background">
        <WhyNexusSection />
      </CardSection>

      {/* ── CTA ──────────────────────────────────────────── */}
      <CardSection index={5} totalSections={TOTAL} id="cta" className="bg-background">
        <CtaSection />
      </CardSection>

    </main>
  )
}