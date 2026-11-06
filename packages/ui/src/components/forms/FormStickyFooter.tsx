import { type ReactNode } from 'react';

import { cn } from '../../utilities/cn';

export interface FormStickyFooterProps {
  /** The buttons: Save, Save and add another, Cancel. */
  children: ReactNode;
  /** A short note on the left, e.g. "Unsaved changes". */
  note?: ReactNode;
  className?: string;
}

// The bar of buttons at the bottom of a long form. It sticks to the bottom of
// the screen so Save is always in reach, without covering the last field
// (the form keeps its own space below it).
export function FormStickyFooter({
  children,
  note,
  className,
}: FormStickyFooterProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-raised -mx-space-4 mt-space-8 border-t border-border-default bg-surface-elevated px-space-4 py-space-3 sm:mx-0 sm:rounded-sm sm:border',
        'flex flex-col-reverse gap-space-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div
        className="font-body text-caption text-text-muted"
        aria-live="polite"
      >
        {note}
      </div>
      <div className="flex flex-col gap-space-3 sm:flex-row sm:items-center">
        {children}
      </div>
    </div>
  );
}

FormStickyFooter.displayName = 'FormStickyFooter';
