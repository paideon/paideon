import { CardSection } from "@/components/ui/CardSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { AccessSection } from "@/components/sections/AccessSection";
import { ExploreSection } from "@/components/sections/ExploreSection";
import { WhyNexusSection } from "@/components/sections/WhyNexusSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { LIBRARY_STATS_FALLBACK, type LibraryStats } from "@paideon/types";

async function getLibraryStats(): Promise<LibraryStats> {
  return LIBRARY_STATS_FALLBACK;
}

// Page
export default async function LandingPage() {
  const stats = await getLibraryStats();

  return (
    <main>
      {/* Hero  */}
      <CardSection index={0} id="hero" className="fixed inset-0 -z-10">
        <HeroSection />
      </CardSection>

      {/*  About  */}
      <CardSection index={1} id="about">
        <AboutSection stats={stats} />
      </CardSection>

      {/*  Access  */}
      <CardSection index={2} id="access">
        <AccessSection />
      </CardSection>

      {/*  Explore  */}
      <CardSection index={3} id="explore">
        <ExploreSection stats={stats} />
      </CardSection>

      {/*  Why Nexus  */}
      <CardSection index={4} id="why-paideon">
        <WhyNexusSection />
      </CardSection>

      {/*  CTA  */}
      <CardSection index={5} id="cta">
        <CtaSection />
      </CardSection>
    </main>
  );
}
