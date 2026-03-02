'use client'

// ── SearchBar ──────────────────────────────────────────────────────────────
//
// Standalone, reusable search component. Used on:
//   - Landing page (ExploreSection) — onSearch navigates to /search
//   - Search results page (/search) — onSearch updates URL params + calls API
//   - Digital Vault page — same component, different onSearch handler
//
// The component owns its own input state but does NOT decide what happens
// on submit. That's the caller's responsibility via onSearch().
//
// ── Future additions (slots already designed for): ────────────────────────
//   suggestions  — pass string[] from API, renders <SearchSuggestions />
//   initialQuery — pre-fills input (search page reads from URL params)
//   isLoading    — shows spinner inside button while API responds
//   disabled     — greys everything out

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Filter options ─────────────────────────────────────────────────────────
// Kept here so the search page can import and reuse the same list
export const SEARCH_FILTERS = [
  'All Books',
  'Digital Vault',
  'Fiction',
  'Non-Fiction',
  'Science',
] as const

export type SearchFilter = (typeof SEARCH_FILTERS)[number]

// ── Props ──────────────────────────────────────────────────────────────────
export interface SearchBarProps {
  // Called when user submits — parent decides what to do (navigate / fetch)
  onSearch: (query: string, filter: SearchFilter) => void

  // Hint text at the bottom — e.g. "8,500+ titles available"
  bookCount?: number

  // Pre-fill the input — used by /search page to reflect URL params
  initialQuery?: string

  // Autocomplete suggestions from the API — renders dropdown when provided
  // PHASE 2: wire up to GET /api/books/suggest?q=...
  suggestions?: string[]

  // Show loading state inside the search button
  isLoading?: boolean
}

// ── Component ──────────────────────────────────────────────────────────────
export function SearchBar({
  onSearch,
  bookCount,
  initialQuery = '',
  suggestions = [],
  isLoading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [filter, setFilter] = useState<SearchFilter>('All Books')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync initialQuery if the parent updates it (e.g. browser back/forward)
  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Show suggestions dropdown when there are results and input is focused
  useEffect(() => {
    setShowSuggestions(isFocused && suggestions.length > 0 && query.length > 0)
  }, [isFocused, suggestions, query])

  const handleSubmit = () => {
    const val = query.trim()
    if (!val || isLoading) return
    setShowSuggestions(false)
    onSearch(val, filter)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    onSearch(suggestion, filter)
  }

  return (
    <div ref={containerRef} className="w-full max-w-[740px]">

      {/* ── Breathing glow — pulses when idle, steady when focused ── */}
      <motion.div
        className="relative"
        animate={{
          boxShadow: isFocused
            ? '0 0 0 1px rgba(255,255,255,0.12)'
            : [
                '0 0 0 1px rgba(255,255,255,0.04)',
                '0 0 0 1px rgba(255,255,255,0.09)',
                '0 0 0 1px rgba(255,255,255,0.04)',
              ],
        }}
        transition={
          isFocused
            ? { duration: 0.3 }
            : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <div className="flex border border-border bg-card focus-within:border-border-strong transition-colors duration-300">

          {/* ── Filter dropdown ──────────────────────────────────── */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as SearchFilter)}
            className="
              bg-transparent
              border-r border-border
              text-subtle
              font-mono text-label tracking-[0.12em]
              px-5 outline-none
              appearance-none
              min-w-[130px]
              cursor-pointer
              hover:text-muted
              transition-colors duration-200
            "
          >
            {SEARCH_FILTERS.map((opt) => (
              <option key={opt} value={opt} className="bg-card text-foreground">
                {opt}
              </option>
            ))}
          </select>

          {/* ── Text input ───────────────────────────────────────── */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search by title, author, or ISBN…"
            aria-label="Search books"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            className="
              flex-1
              bg-transparent
              text-foreground
              font-body text-sm font-light
              px-6 py-5
              outline-none
              placeholder:text-subtle
            "
          />

          {/* ── Submit button ────────────────────────────────────── */}
          <motion.button
            onClick={handleSubmit}
            whileTap={isLoading ? {} : { scale: 0.97 }}
            disabled={isLoading}
            aria-label="Search"
            className="
              bg-card hover:bg-hover
              text-subtle hover:text-muted
              font-mono text-label tracking-[0.15em] uppercase
              px-9
              border-l border-border hover:border-border-strong
              transition-all duration-200
              flex-shrink-0
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              // Minimal spinner — same visual weight as the text
              <motion.span
                className="block w-3 h-3 border border-subtle rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              'Search'
            )}
          </motion.button>

        </div>

        {/* ── Suggestions dropdown ─────────────────────────────── */}
        {/* PHASE 2: populated when API returns suggestions */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.ul
              role="listbox"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="
                absolute top-full left-0 right-0 z-50
                bg-card border border-border border-t-0
                divide-y divide-border
                max-h-64 overflow-y-auto
              "
            >
              {suggestions.map((suggestion, i) => (
                <motion.li
                  key={i}
                  role="option"
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                  className="
                    px-6 py-3
                    font-body text-sm font-light text-muted
                    hover:text-foreground hover:bg-hover
                    cursor-pointer
                    transition-colors duration-150
                  "
                >
                  {suggestion}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

      </motion.div>

      {/* ── Hint text ───────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-3 font-mono text-label tracking-[0.15em] text-subtle opacity-40"
      >
        Press Enter to search
        {bookCount !== undefined && ` · ${bookCount.toLocaleString()}+ titles available`}
      </motion.p>

    </div>
  )
}