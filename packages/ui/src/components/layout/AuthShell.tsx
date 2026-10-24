import { type ReactNode } from 'react';

import { cn } from '../../utilities/cn';
import { SchoolLogo } from '../icons/brand/SchoolLogo';
import { Heading } from '../typography/Heading';
import { Text } from '../typography/Text';

type Props = {
  title: string;
  subtitle?: string;
  /** Short line under the brand name on the green panel. */
  tagline?: string;
  /** Product name shown on the brand panel. */
  brandName?: string;
  children: ReactNode;
  /** Links under the form, e.g. "First time here? Activate your account". */
  footer?: ReactNode;
  className?: string;
};

export function AuthShell({
  title,
  subtitle,
  tagline,
  brandName = 'Paideon',
  children,
  footer,
  className,
}: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-canopy p-space-4 md:p-space-8">
      <div
        className={cn(
          'grid w-full max-w-4xl overflow-hidden rounded-lg border border-border-light bg-surface-elevated shadow-elevation-3 md:grid-cols-[2fr_3fr]',
          className,
        )}
      >
        {/* Brand panel: solid brand green with the vivid crest, in BOTH themes.
            Uses the on-brand tokens, not text-inverse (which flips in dark). */}
        <aside className="hidden flex-col items-center justify-center gap-space-6 bg-surface-brand p-space-10 text-center md:flex">
          <div className="w-48">
            <SchoolLogo variant="crest-only" color="brand-gold" />
          </div>
          <Heading level="h3" className="text-text-on-brand">
            {brandName}
          </Heading>
          {tagline && (
            <Text variant="body-sm" className="text-text-on-brand">
              {tagline}
            </Text>
          )}
        </aside>

        <section className="flex flex-col justify-center gap-space-8 p-space-6 md:p-space-12">
          <header className="flex flex-col gap-space-2">
            <Heading as="h1" level="h2">
              {title}
            </Heading>
            {subtitle && <Text color="muted">{subtitle}</Text>}
          </header>
          {children}
          {footer && (
            <footer className="flex flex-col gap-space-2 text-body-sm">
              {footer}
            </footer>
          )}
        </section>
      </div>
    </main>
  );
}

AuthShell.displayName = 'AuthShell';
