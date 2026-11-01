import { type ReactNode } from 'react';

import { cn } from '../../utilities/cn';

export interface KeyValueItem {
  label: string;
  value: ReactNode;
}

export interface KeyValueListProps {
  items: KeyValueItem[];
  /** Shown instead of the value when it is empty (null, undefined or ''). */
  emptyText?: string;
  className?: string;
}

// A description list: "Label: value" rows for DETAIL pages. Stacked on
// phones, label beside value from `sm` up.
export function KeyValueList({
  items,
  emptyText = '—',
  className,
}: KeyValueListProps) {
  return (
    <dl className={cn('m-space-0 flex flex-col', className)}>
      {items.map((item) => {
        const empty =
          item.value === null || item.value === undefined || item.value === '';
        return (
          <div
            key={item.label}
            className="grid gap-space-1 border-b border-border-light py-space-3 last:border-b-0 sm:grid-cols-[12rem_1fr] sm:gap-space-4"
          >
            <dt className="font-body text-label-sm uppercase tracking-label-sm text-text-muted">
              {item.label}
            </dt>
            <dd
              className={cn(
                'm-space-0 min-w-0 break-words font-body text-body',
                empty ? 'text-text-muted' : 'text-text-primary',
              )}
            >
              {empty ? emptyText : item.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

KeyValueList.displayName = 'KeyValueList';
