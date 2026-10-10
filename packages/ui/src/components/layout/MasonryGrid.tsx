'use client';

import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';

export interface MasonryGridProps {
  children: React.ReactNode[];
  columnCount?: { mobile?: number; tablet?: number; desktop?: number };
  gap?: number;
  className?: string;
}

export function MasonryGrid({
  children,
  columnCount = { mobile: 2, tablet: 3, desktop: 4 },
  gap = 16,
  className,
}: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(columnCount.desktop || 4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(columnCount.mobile || 2);
      else if (width < 1024) setColumns(columnCount.tablet || 3);
      else setColumns(columnCount.desktop || 4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columnCount]);

  // Distribute children into columns
  const columnArrays: React.ReactNode[][] = Array.from(
    { length: columns },
    () => [],
  );
  children.forEach((child, idx) => {
    columnArrays[idx % columns].push(child);
  });

  return (
    <div
      ref={containerRef}
      className={clsx('flex', className)}
      style={{ gap: `${gap}px` }}
    >
      {columnArrays.map((column, idx) => (
        <div
          key={idx}
          className="flex-1 flex flex-col"
          style={{ gap: `${gap}px` }}
        >
          {column.map((item, i) => (
            <div key={i} className="w-full">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
