import { type ReactNode } from 'react';

import { Button } from '../atoms/Button';
import { Icon } from '../icons/Icon';

export interface TopbarProps {
  /** Opens the mobile drawer. The menu button is hidden from `lg` up. */
  onMenuClick?: () => void;
  menuLabel?: string;
  /** Left side, next to the menu button: normally the breadcrumbs. */
  start?: ReactNode;
  /** Right side: theme toggle, user menu. */
  end?: ReactNode;
}

// z-raised (10) on purpose: Drawer and Modal use higher layers and must
// cover the bar.
export function Topbar({
  onMenuClick,
  menuLabel = 'Open menu',
  start,
  end,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-raised flex h-size-14 items-center gap-space-3 border-b border-border-light bg-surface-elevated px-space-4">
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={onMenuClick}
          aria-label={menuLabel}
          className="lg:hidden"
        >
          <Icon name="menu" size="sm" />
        </Button>
      )}
      <div className="min-w-0 flex-1">{start}</div>
      <div className="flex items-center gap-space-2">{end}</div>
    </header>
  );
}

Topbar.displayName = 'Topbar';
