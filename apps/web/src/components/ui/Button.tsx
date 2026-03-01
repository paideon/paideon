'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'


export function Button({
  href,
  children,
  variant = 'default',
  size = 'md',
  breathe = false,
}: {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'gold'
  size?: 'md' | 'lg'
  breathe?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const isGold = variant === 'gold'
  const isLg = size === 'lg'

  // Fill color — gold variant floods solid gold (text flips to bg), default is a subtle white tint
  const fillBackground = isGold ? 'rgba(201,168,76,1)' : 'rgba(255,255,255,0.04)'

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Breathing — very slow scale pulse when idle, stops on hover
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
        inline-flex items-center
        font-mono text-label uppercase
        transition-colors duration-200
        group
        ${isLg ? 'gap-4 px-12 py-5 tracking-[0.18em]' : 'gap-3 px-9 py-4 tracking-[0.15em]'}
        ${
          isGold
            ? 'bg-gold-muted border border-gold/30 hover:border-gold text-gold hover:bg-gold hover:text-background'
            : 'border border-border hover:border-border-strong text-muted hover:text-foreground'
        }
        ${!isGold && isLg ? 'bg-card' : ''}
      `}
    >
      {/* Fill flood — floods from left edge on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: isLg ? 0.45 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: fillBackground,
          originX: 0,
          zIndex: 0,
        }}
      />

      <span className="relative z-10 transition-colors duration-200">
        {children}
      </span>

      <motion.span
        className="relative z-10"
        animate={{ x: isHovered ? (isLg ? 5 : 4) : 0 }}
        transition={{ duration: 0.2 }}
      >
        →
      </motion.span>
    </motion.a>
  )
}