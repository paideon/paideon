'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';

import { Drawer } from '../overlays/Drawer';
import { Topbar } from './Topbar';

export interface AppShellProps {
  /**
   * The navigation. Rendered twice by design: fixed on the left from `lg`
   * up, and inside a Drawer on phones. It receives `onNavigate` so the
   * drawer can close itself when a link is chosen.
   */
  sidebar: (props: { onNavigate?: () => void }) => ReactNode;
  topbarStart?: ReactNode;
  topbarEnd?: ReactNode;
  children: ReactNode;
}

export function AppShell({
  sidebar,
  topbarStart,
  topbarEnd,
  children,
}: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer after any navigation (including back/forward).
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <div className="flex min-h-screen bg-surface-default">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-space-4 focus:top-space-4 focus:z-toast focus:rounded-sm focus:bg-green-base focus:px-space-4 focus:py-space-2 focus:text-text-inverse"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border-light lg:block">
        {sidebar({})}
      </aside>

      {/* The Drawer always mounts its panel, even when closed, so only fill
          it while open: otherwise the nav would exist twice for screen
          readers and the closed panel could still take focus. */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="sm"
        className="lg:hidden"
      >
        {drawerOpen
          ? sidebar({ onNavigate: () => setDrawerOpen(false) })
          : null}
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onMenuClick={() => setDrawerOpen(true)}
          start={topbarStart}
          end={topbarEnd}
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

AppShell.displayName = 'AppShell';
