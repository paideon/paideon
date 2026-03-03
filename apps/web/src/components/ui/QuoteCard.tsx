// Quote cards — the dealing animation — each card starts slightly rotated and scaled down, then settles flat. The rotation alternates direction — card 0 tilts left, card 1 tilts right, card 2 tilts left. Like cards being placed on a table from a hand. They arrive with a 120ms stagger.

'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'


export function QuoteCard({
  text,
  author,
  index,
}: {
  text: string
  author: string
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })

  const delay = index * 0.12

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 40,
        rotate: index % 2 === 0 ? -1.5 : 1.5,
        scale: 0.96,
      }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
          : {}
      }
      transition={{
        delay,
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        flex-1
        bg-background
        border border-border
        hover:border-border-strong
        hover:bg-card
        p-7
        flex flex-col gap-4
        transition-colors duration-300
        group
        cursor-default
      "
    >
      {/* Quote mark */}
      <span
        className="font-display text-5xl font-light leading-none text-subtle opacity-30 select-none"
        aria-hidden="true"
      >
        "
      </span>

      {/* Quote text */}
      <p className="font-display text-[17px] italic font-light leading-[1.6] text-subtle group-hover:text-muted transition-colors duration-300 flex-1">
        {text.replace(/^"|"$/g, '')}
      </p>

      {/* Divider */}
      <div className="w-6 h-px bg-border-strong group-hover:w-10 transition-all duration-500" />

      {/* Author */}
      <span className="font-mono text-label tracking-[0.2em] text-subtle uppercase">
        {author}
      </span>
    </motion.div>
  )
}