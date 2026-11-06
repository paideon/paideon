import Link from 'next/link';
import { type ReactNode } from 'react';

import { Icon } from '../icons/Icon';
import { Heading } from '../typography/Heading';
import { Text } from '../typography/Text';

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** "Back to Students" link above the title. */
  back?: { href: string; label: string };
  /** Buttons on the right (Add, Export, ...). */
  actions?: ReactNode;
  /** A picture beside the title, e.g. a person's Avatar. */
  media?: ReactNode;
  /** A row under the title for badges and short facts (class, status). */
  meta?: ReactNode;
}

export function PageHeader({
  title,
  description,
  back,
  actions,
  media,
  meta,
}: PageHeaderProps) {
  return (
    <header className="mb-space-6 flex flex-col gap-space-3">
      {back && (
        <Link
          href={back.href}
          className="inline-flex w-fit items-center gap-space-1 font-body text-label-sm uppercase tracking-label-sm text-text-muted hover:text-gold-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-base"
        >
          <Icon name="arrow-left" size="xs" aria-hidden="true" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-space-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-space-4">
          {media}
          <div className="flex min-w-0 flex-col gap-space-1">
            <Heading as="h1" level="h2">
              {title}
            </Heading>
            {description && <Text color="muted">{description}</Text>}
            {meta && (
              <div className="mt-space-1 flex flex-wrap items-center gap-space-2">
                {meta}
              </div>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-space-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

PageHeader.displayName = 'PageHeader';
