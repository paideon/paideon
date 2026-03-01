// `FillButton` — on hover, a background color floods in from the left edge using `scaleX` with `originX: 0`. The fill completes in 400ms with a premium ease curve. The arrow shifts 4px right simultaneously. Two variants — `default` for Sign In (white tint) and `gold` for Open Vault (gold tint).

'use client'
import { useState } from "react"
import { motion } from "framer-motion"

export function FillButton({
  href,
  children,
  variant = 'default',
}: {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'gold'
}) {
  const [isHovered, setIsHovered] = useState(false)

  const fillColor = variant === 'gold'
    ? 'rgba(201,168,76,0.12)'
    : 'rgba(255,255,255,0.04)'

  return (
    <a
      href={href}
      className="
        relative overflow-hidden
        inline-flex items-center gap-3
        border border-border hover:border-border-strong
        font-mono text-label tracking-[0.15em] uppercase
        text-muted hover:text-foreground
        px-9 py-4
        transition-colors duration-200
        group
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fill animation — floods from left on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: fillColor,
          originX: 0,
        }}
      />
      <span className="relative z-10">{children}</span>
      <motion.span
        className="relative z-10"
        animate={{ x: isHovered ? 4 : 0 }}
        transition={{ duration: 0.2 }}
      >
        →
      </motion.span>
    </a>
  )
}