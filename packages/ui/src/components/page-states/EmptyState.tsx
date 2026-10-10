'use client';

import { cn } from '../../utilities/cn';
import { Button } from '../atoms/Button';
import { Heading } from '../typography/Heading';
import { Text } from '../typography/Text';

export interface EmptyStateProps {
  heading: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ heading, description, action }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-space-16 px-space-6 text-center',
      )}
    >
      {/* Crest motif */}
      <div
        aria-hidden="true"
        className={cn(
          'w-size-14 h-size-14 rounded-full',
          'border border-border-light',
          'flex items-center justify-center',
          'mb-space-6',
          'opacity-35',
        )}
      >
        <span
          className={cn(
            'font-display text-[1.5rem] font-medium italic',
            'text-gold-base',
          )}
        >
          K
        </span>
      </div>

      <Heading level="h3" className="mb-space-2p5">
        {heading}
      </Heading>

      {description && (
        <Text
          variant="body-sm"
          color="muted"
          className={cn('max-w-[360px]', action ? 'mb-space-6' : 'mb-0')}
        >
          {description}
        </Text>
      )}

      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}
