import { type ReactNode } from 'react';

import { cn } from '../../utilities/cn';

export interface PrintSheetProps {
  children: ReactNode;
  /** Columns of the grid inside the sheet. 1 centres a single item. */
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const columnClass = {
  1: 'grid-cols-1 justify-items-center',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
} as const;

// An A4 page for things that get printed (ID cards, labels, slips).
//
// On screen it is a white sheet on the page. When printing, everything else
// on the page is hidden and the sheet fills the paper with no margin of its
// own (the print dialog's margins apply), so cards print at true size.
//
// The print rules live in a <style> tag here so the component works in any
// app without extra CSS.
export function PrintSheet({
  children,
  columns = 1,
  className,
}: PrintSheetProps) {
  return (
    <>
      <style>{`
        @page { size: A4; margin: 10mm; }
        @media print {
          body * { visibility: hidden !important; }
          .print-sheet, .print-sheet * { visibility: visible !important; }
          .print-sheet {
            position: absolute; left: 0; top: 0; width: 100%;
            box-shadow: none !important; border: 0 !important;
            padding: 0 !important; min-height: 0 !important;
          }
        }
      `}</style>
      <div
        className={cn(
          'print-sheet mx-auto grid w-full max-w-[210mm] gap-space-4 border border-border-light bg-white p-space-6 shadow-elevation-1',
          columnClass[columns],
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}

PrintSheet.displayName = 'PrintSheet';
