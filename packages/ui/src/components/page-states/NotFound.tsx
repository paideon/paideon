"use client";

import { motion, useTransform } from "framer-motion";

import { useCountUp } from "../../hooks/useCountUp";
import { cn } from "../../utilities/cn";
import { ButtonLink } from "../atoms/ButtonLink";
import { SchoolLogo } from "../icons/brand/SchoolLogo";
import { Divider } from "../layout/Divider";
import { NavLink } from "../navigation/NavLink";
import { EyebrowLabel } from "../typography/EyebrowLabel";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

export interface QuickLink {
  href: string;
  label: string;
}

const DEFAULT_QUICK_LINKS: QuickLink[] = [
  { href: "/", label: "Homepage" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About KCC" },
  { href: "/admissions", label: "Admissions" },
  { href: "/contact", label: "Contact" },
];

export interface NotFoundPageProps {
  eyebrowLabel?: string;
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
  quickNavAriaLabel?: string;
  quickLinksIntro?: string;
  quickLinks?: QuickLink[];
  footerText?: string;
}

export function NotFoundPage({
  eyebrowLabel = "Page not found",
  message = "The page you're looking for may have been moved, renamed, or removed.",
  ctaLabel = "Return to homepage",
  ctaHref = "/",
  quickNavAriaLabel = "Quick navigation links",
  quickLinksIntro = "Or jump to",
  quickLinks = DEFAULT_QUICK_LINKS,
  footerText = "C.W.W. Kannangara Central College, Mathugama — Est. 1873",
}: NotFoundPageProps) {
  const { value: animated404 } = useCountUp(404);
  const display404 = useTransform(animated404, Math.round);

  return (
    <main className="min-h-screen bg-green-base flex flex-col items-center justify-center py-space-16 px-space-6 relative overflow-hidden">
      <div className="relative z-10 text-center max-w-prose">
        {/* School crest */}
        <div className="mb-space-8 flex justify-center">
          <SchoolLogo variant="crest-only" size="lg" />
        </div>

        {/* Animated 404 heading */}
        <Heading level="h1" color="inverse" className="mb-space-4">
          <motion.span>{display404}</motion.span>
        </Heading>

        {/* Eyebrow label */}
        <EyebrowLabel className="mb-space-6 text-text-inverse/45">
          {eyebrowLabel}
        </EyebrowLabel>

        {/* Message – using Text component */}
        <Text
          variant="body"
          color="inverse"
          className="text-text-inverse/55 mb-space-8 max-w-md mx-auto"
        >
          {message}
        </Text>

        {/* Primary CTA – using Button component */}
        <ButtonLink
          href={ctaHref}
          variant="primary"
          className="bg-gold-base text-green-base hover:bg-transparent hover:text-gold-base border-gold-base"
          leftIcon={<span aria-hidden="true">←</span>}
        >
          {ctaLabel}
        </ButtonLink>

        {/* Divider */}
        <Divider accentVariant="gold-accent-narrow" />

        {/* Quick links section */}
        <Text
          variant="caption"
          color="inverse"
          className="text-text-inverse/35 mb-space-4"
        >
          {quickLinksIntro}
        </Text>

        <nav aria-label={quickNavAriaLabel}>
          <ul className="flex flex-wrap gap-space-2 justify-center">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  className={cn(
                    "font-body text-caption uppercase tracking-caption",
                    "text-text-inverse/55 px-space-3 py-space-1.5",
                    "border border-white/15 rounded-sm",
                    "transition-colors duration-fast ease-snap",
                    "hover:text-gold-base hover:border-gold-base/40",
                    "focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-2"
                  )}
                  activeClassName="text-gold-base border-gold-base"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer line – using Text component */}
        <Text
          variant="body-sm"
          color="inverse"
          className="text-text-inverse/20 mt-space-12 italic font-display"
        >
          {footerText}
        </Text>
      </div>
    </main>
  );
}
