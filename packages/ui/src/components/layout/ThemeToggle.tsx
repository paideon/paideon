'use client';

import { useEffect, useState } from 'react';
import { Button, Icon } from '@paideon/ui';

const STORAGE_KEY = 'paideon-theme';

type Theme = 'light' | 'dark';

/**
 * Switches between the light and dark theme.
 *
 * The inline script in app/layout.tsx has already put the right `data-theme`
 * on <html> before first paint; this component only reads it and changes it.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'dark'
        : 'light',
    );
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode): the theme still applies this visit.
    }
    setTheme(next);
  }

  return (
    <Button
      variant="ghost"
      size="icon-md"
      onClick={toggle}
      disabled={theme === null}
      aria-label={
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      }
    >
      <Icon
        name={theme === 'dark' ? 'sun' : 'moon'}
        size="sm"
        aria-hidden="true"
      />
    </Button>
  );
}
