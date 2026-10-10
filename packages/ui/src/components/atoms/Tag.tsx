// components/atoms/Tag.tsx
'use client';

import { cn } from '../../utilities/cn';
interface TagProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Tag({ label, active = false, onClick, className }: TagProps) {
  const isInteractive = Boolean(onClick);

  return (
    <span
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick?.();
            }
          : undefined
      }
      className={cn(
        'inline-flex items-center px-space-3 py-space-2 rounded-full font-body text-caption select-none whitespace-nowrap',
        'transition-all duration-fast ease-snap',
        active
          ? 'bg-green-base text-text-inverse'
          : 'bg-surface-default text-text-muted',
        isInteractive &&
          !active &&
          'hover:bg-surface-deep hover:text-text-primary cursor-pointer',
        isInteractive && active && 'hover:bg-green-hover cursor-pointer',
        isInteractive &&
          'focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-[3px]',
        !isInteractive && 'cursor-default',
        className,
      )}
    >
      {label}
    </span>
  );
}

Tag.displayName = 'Tag';
