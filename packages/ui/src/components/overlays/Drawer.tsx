// packages/ui/src/components/layout/Drawer.tsx
'use client';

import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface DrawerProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  persistent?: boolean; // For admin sidebar
  className?: string;
}

const sizeMap = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
};

export function Drawer({
  children,
  isOpen = false,
  onClose,
  position = 'left',
  size = 'md',
  persistent = false,
  className,
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // For persistent admin sidebar
  if (persistent) {
    return (
      <aside
        className={clsx(
          'h-screen bg-surface-inverse text-text-inverse flex-shrink-0 overflow-y-auto',
          sizeMap[size],
          className,
        )}
      >
        {children}
      </aside>
    );
  }

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-overlay-medium z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={clsx(
          'fixed top-0 bottom-0 bg-surface-elevated shadow-elevation-3 z-50 transition-transform duration-300 ease-out',
          position === 'left' ? 'left-0' : 'right-0',
          sizeMap[size],
          isOpen
            ? 'translate-x-0'
            : position === 'left'
              ? '-translate-x-full'
              : 'translate-x-full',
          className,
        )}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
