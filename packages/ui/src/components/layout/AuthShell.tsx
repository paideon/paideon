import { type ReactNode } from 'react';

import { cn } from '../../utilities/cn';
import { SchoolLogo } from '../icons/brand/SchoolLogo';
import { Heading } from '../typography/Heading';
import { Text } from '../typography/Text';

type Props = {
  title: string;
  brandName?: string;
  subtitle?: string;
  /** Short line under the brand name on the green panel. */
  tagline?: string;
  children: ReactNode;
  /** Links under the form, e.g. "First time? Activate your account". */
  footer?: ReactNode;
  className?: string;
};

export function AuthShell({
  title,
  brandName,
  subtitle,
  tagline,
  children,
  footer,
  className,
}: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-canopy p-space-4 md:p-space-8">
      <div
        className={cn(
          'grid w-full max-w-4xl overflow-hidden rounded-lg bg-surface-base shadow-lg md:grid-cols-[2fr_3fr]',
          className,
        )}
      >
        <aside className="hidden flex-col items-center justify-center gap-space-6 bg-green-base p-space-10 text-center md:flex">
          <div className="w-48">
            <SchoolLogo variant="crest-only" color="gold" />
          </div>
          <Heading level="h3" color="inverse">
            {brandName}
          </Heading>
          {tagline && (
            <Text variant="body-sm" color="inverse">
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
