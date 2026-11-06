'use client';

import { useId, useState, type ReactNode } from 'react';

import { cn } from '../../utilities/cn';
import { Button } from '../atoms/Button';

export interface FilterPanelProps {
  /** The filter fields (Select, Checkbox, ...). Laid out in a responsive grid. */
  children: ReactNode;
  /** How many filters are set now. Shown on the toggle and enables Clear. */
  activeCount?: number;
  onClear?: () => void;
  /** Start open. On a phone the panel is closed by default to save space. */
  defaultOpen?: boolean;
  title?: string;
  clearLabel?: string;
  className?: string;
}

// A box of filters that can be folded away. On screens from "md" up it is
// always visible; below that, a button opens and closes it.
export function FilterPanel({
  children,
  activeCount = 0,
  onClear,
  defaultOpen = false,
  title = 'Filters',
  clearLabel = 'Clear filters',
  className,
}: FilterPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <section
      aria-label={title}
      className={cn(
        'rounded-sm border border-border-light bg-surface-elevated',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-space-3 px-space-4 py-space-3">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="font-body text-label uppercase tracking-label text-text-primary md:pointer-events-none focus-visible:outline-2 focus-visible:outline-gold-base"
        >
          {title}
          {activeCount > 0 && (
            <span className="ml-space-2 inline-flex min-w-[18px] items-center justify-center rounded-full bg-green-base px-space-1p5 text-[0.65rem] leading-[18px] text-text-inverse">
              {activeCount}
            </span>
          )}
          <span className="ml-space-2 md:hidden" aria-hidden="true">
            {open ? '▴' : '▾'}
          </span>
        </button>
        {onClear && (
          <Button
            type="button"
            variant="link"
            size="sm"
            disabled={activeCount === 0}
            onClick={onClear}
          >
            {clearLabel}
          </Button>
        )}
      </div>
      <div
        id={panelId}
        className={cn(
          'grid grid-cols-1 gap-space-4 border-t border-border-light px-space-4 py-space-4 sm:grid-cols-2 lg:grid-cols-4',
          open ? 'grid' : 'hidden md:grid',
        )}
      >
        {children}
      </div>
    </section>
  );
}

FilterPanel.displayName = 'FilterPanel';
