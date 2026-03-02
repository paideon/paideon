'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    // Read current theme from html attribute on mount
    const current = document.documentElement.getAttribute('data-theme')
    if (current === 'dark') setTheme('dark')
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="font-mono text-label tracking-[0.2em] uppercase text-subtle hover:text-foreground transition-colors duration-200"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}