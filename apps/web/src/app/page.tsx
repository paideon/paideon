import { CardSection } from '@/components/ui/CardSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { AccessSection } from '@/components/sections/AccessSection'
import { ExploreSection } from '@/components/sections/ExploreSection'
import { WhyNexusSection } from '@/components/sections/WhyNexusSection'
import { CtaSection } from '@/components/sections/CtaSection'
import { LIBRARY_STATS_FALLBACK, type LibraryStats } from '@nexus/types'

const TOTAL = 6


async function getLibraryStats(): Promise<LibraryStats> {
  return LIBRARY_STATS_FALLBACK
}

// Page 
export default async function LandingPage() {
  const stats = await getLibraryStats()

  return (
    <main>

      {/* Hero  */}
      <CardSection index={0} id="hero" className="bg-background">
        <HeroSection />
      </CardSection>

      {/*  About  */}
      <CardSection index={1} id="about" className="bg-card">
        <AboutSection stats={stats} />
      </CardSection>

      {/*  Access  */}
      <CardSection index={2} id="access" className="bg-background">
        <AccessSection />
      </CardSection>

      {/*  Explore  */}
      <CardSection index={3} id="explore" className="bg-card">
        <ExploreSection stats={stats} />
      </CardSection>

      {/*  Why NEXUS  */}
      <CardSection index={4} id="why-nexus" className="bg-background">
        <WhyNexusSection />
      </CardSection>

      {/*  CTA  */}
      <CardSection index={5} id="cta" className="bg-card">
        <CtaSection />
      </CardSection>

    </main>
  )
}