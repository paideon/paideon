'use client'

import { useState } from "react"
import { motion } from "framer-motion"

export function Button({
  href,
  children,
  variant = 'default',
  breathe = false,
}: {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'gold'
  breathe?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const isGold = variant === 'gold'

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Breathing — very slow scale pulse when idle, stops when hovered
      animate={
        breathe && !isHovered
          ? { scale: [1, 1.015, 1] }
          : { scale: 1 }
      }
      transition={
        breathe && !isHovered
          ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.2 }
      }
      className={`
        relative overflow-hidden
        inline-flex items-center gap-4
        font-mono text-label tracking-[0.18em] uppercase
        px-12 py-5
        transition-colors duration-200
        group
        ${
          isGold
            ? 'bg-gold-muted border border-gold/30 hover:border-gold text-gold hover:bg-gold hover:text-background'
            : 'bg-card border border-border hover:border-border-strong text-muted hover:text-foreground'
        }
      `}
    >
      {/* Fill flood on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: isGold
            ? 'rgba(201,168,76,1)'
            : 'rgba(255,255,255,0.04)',
          originX: 0,
          zIndex: 0,
        }}
      />

      <span className="relative z-10 transition-colors duration-200">
        {children}
      </span>

      <motion.span
        className="relative z-10"
        animate={{ x: isHovered ? 5 : 0 }}
        transition={{ duration: 0.2 }}
      >
        →
      </motion.span>
    </motion.a>
  )
}