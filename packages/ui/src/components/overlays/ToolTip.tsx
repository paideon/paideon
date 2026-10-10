// components/atoms/Tooltip.tsx
'use client';

import { useState, useRef, useId, useEffect } from 'react';

import { cn } from '../../utilities/cn';

type Position = 'top' | 'bottom' | 'left' | 'right';

type TooltipProps = {
  content: string;
  position?: Position;
  children: React.ReactNode; // ✅ now accepts any renderable content
  className?: string;
};

const positionStyles: Record<Position, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-space-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-space-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-space-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-space-2',
};

const arrowStyles: Record<Position, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-surface-inverse border-x-transparent border-b-transparent',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-b-surface-inverse border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-surface-inverse border-y-transparent border-r-transparent',
  right:
    'right-full top-1/2 -translate-y-1/2 border-r-surface-inverse border-y-transparent border-l-transparent',
};

export function ToolTip({
  content,
  position = 'top',
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), 300);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-modal w-max max-w-[200px] px-space-3 py-space-2',
            'bg-surface-inverse text-text-inverse font-body text-caption rounded-sm',
            'pointer-events-none',
            positionStyles[position],
            className,
          )}
        >
          {content}
          {/* Arrow */}
          <span
            className={cn('absolute w-0 h-0 border-4', arrowStyles[position])}
            aria-hidden="true"
          />
        </span>
      )}

      <span
        aria-describedby={visible ? tooltipId : undefined}
        className="inline-flex"
      >
        {children}
      </span>
    </span>
  );
}

ToolTip.displayName = 'Tooltip';
