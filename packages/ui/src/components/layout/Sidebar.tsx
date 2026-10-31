'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

import { cn } from '../../utilities/cn';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/registry';

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon?: IconName;
}

export interface SidebarGroup {
  id: string;
  label: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  groups: SidebarGroup[];
  /** Crest and name at the top. */
  brand?: ReactNode;
  /** Pinned to the bottom (help link, version, ...). */
  footer?: ReactNode;
  /** Called after a link is chosen; the mobile drawer uses it to close. */
  onNavigate?: () => void;
  ariaLabel?: string;
  className?: string;
}

/** Longest matching href wins, so /library and /library/books never both light up. */
function findActiveHref(pathname: string, groups: SidebarGroup[]) {
  let best: string | null = null;
  for (const group of groups) {
    for (const item of group.items) {
      const matches =
        item.href === '/'
          ? pathname === '/'
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
      if (matches && (best === null || item.href.length > best.length)) {
        best = item.href;
      }
    }
  }
  return best;
}

export function Sidebar({
  groups,
  brand,
  footer,
  onNavigate,
  ariaLabel = 'Main navigation',
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const activeHref = findActiveHref(pathname, groups);

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-surface-elevated text-text-primary',
        className,
      )}
    >
      {brand && (
        <div className="flex items-center gap-space-3 border-b border-border-light p-space-4">
          {brand}
        </div>
      )}

      <nav
        aria-label={ariaLabel}
        className="flex flex-1 flex-col gap-space-6 overflow-y-auto p-space-4"
      >
        {groups.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`sidebar-group-${group.id}`}
            className="flex flex-col gap-space-1"
          >
            <h2
              id={`sidebar-group-${group.id}`}
              className="px-space-3 pb-space-1 font-body text-label-sm uppercase tracking-label-sm text-text-muted"
            >
              {group.label}
            </h2>
            <ul className="m-space-0 flex list-none flex-col gap-space-1 p-space-0">
              {group.items.map((item) => {
                const isActive = item.href === activeHref;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-space-3 rounded-sm border-l-2 px-space-3 py-space-2 font-body text-body-sm',
                        'transition-colors duration-fast ease-snap motion-reduce:transition-none',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-base',
                        isActive
                          ? 'border-gold-base bg-surface-active text-text-primary'
                          : 'border-transparent text-text-muted hover:bg-surface-hover hover:text-text-primary',
                      )}
                    >
                      {item.icon && (
                        <Icon name={item.icon} size="xs" aria-hidden="true" />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      {footer && (
        <div className="border-t border-border-light p-space-4">{footer}</div>
      )}
    </div>
  );
}

Sidebar.displayName = 'Sidebar';
