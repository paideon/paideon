'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface CardSectionProps {
  children: React.ReactNode
  index: number
  totalSections: number
  id?: string
  className?: string
}

export function CardSection({
  children,
  index,
  id,
  className = '',
}: CardSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Trigger once when 10% of the section enters the viewport
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  // Hero section (index 0) — no animation, always visible
  if (index === 0) {
    return (
      <section id={id} className={`w-full ${className}`}>
        {children}
      </section>
    )
  }

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1.0,
        ease: [0.22, 1, 0.36, 1],
        // Slight stagger between sections so they feel separated
        delay: 0.05,
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.section>
  )
}