'use client'

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

import { StatCard } from "@/components/ui/StatCard"

// ── Search bar with breathing animation ───────────────────
function SearchBar() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All Books')
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = () => {
    const val = query.trim()
    if (val) window.location.href = `/search?q=${encodeURIComponent(val)}`
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="w-full max-w-[740px]">

      {/* Breathing glow — pulses when idle, steady when focused */}
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

          {/* Filter dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
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
            {['All Books', 'Digital Vault', 'Fiction', 'Non-Fiction', 'Science'].map((opt) => (
              <option key={opt} className="bg-card text-foreground">
                {opt}
              </option>
            ))}
          </select>

          {/* Search input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search by title, author, or ISBN…"
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

          {/* Search button */}
          <motion.button
            onClick={handleSearch}
            whileTap={{ scale: 0.97 }}
            className="
              bg-card hover:bg-hover
              text-subtle hover:text-muted
              font-mono text-label tracking-[0.15em] uppercase
              px-9
              border-l border-border hover:border-border-strong
              transition-all duration-200
              flex-shrink-0
            "
          >
            Search
          </motion.button>

        </div>
      </motion.div>

      {/* Hint text below */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-3 font-mono text-label tracking-[0.15em] text-subtle opacity-40"
      >
        Press Enter to search · 8,500+ titles available
      </motion.p>

    </div>
  )
}

// Main section
export function ExploreSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  const STATS = [
    { target: 8500,  label: 'Books in\nCatalog' },
    { target: 4198,  label: 'Students\nServed' },
    { target: '24/7', label: 'Digital\nAccess' },
    { target: 0,     label: 'Manual\nProcesses' },
  ]

  return (
    <section
      ref={sectionRef}
      id="explore"
      className="
        relative w-full min-h-screen
        flex flex-col items-start justify-center
        px-[5vw] md:px-[8vw] lg:px-[10vw]
        py-20
        gap-14
        bg-card
        overflow-hidden
      "
    >

      {/* ── Section label ────────────────────────────── */}
      <motion.span
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="font-mono text-label tracking-[0.3em] text-subtle uppercase"
      >
        03 — Explore the Catalog
      </motion.span>

      {/*  Heading */}
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: '110%' }}
          animate={isInView ? { y: '0%' } : {}}
          transition={{ delay: 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-display-lg font-light text-foreground leading-[1.1]"
        >
          Find any book<br />
          <em className="italic text-muted">in the collection.</em>
        </motion.h2>
      </div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.25, duration: 0.9, ease: 'easeOut' }}
        className="w-full"
      >
        <SearchBar />
      </motion.div>

      {/*  Stats grid  */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-px w-full max-w-[740px] bg-border"
      >
        {STATS.map((stat, i) => (
          <StatCard
            key={i}
            target={stat.target}
            label={stat.label}
            index={i}
          />
        ))}
      </motion.div>

      {/* Bottom note  */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="font-mono text-label tracking-[0.15em] text-subtle opacity-40 max-w-md leading-[1.8]"
      >
        Full catalog search available after sign in. Digital Vault resources
        are freely accessible without an account.
      </motion.p>

    </section>
  )
}