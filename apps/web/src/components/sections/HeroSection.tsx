'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { MagneticLetter } from '@/components/ui/MagneticLetter'

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)

  // Mouse position for the ambient light that follows cursor
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      // Convert to percentage so gradient position is relative to section
      mouseX.set(((e.clientX - rect.left) / rect.width) * 100)
      mouseY.set(((e.clientY - rect.top) / rect.height) * 100)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
    >


      {/*  Main content */}
      <div className="relative z-20 flex flex-col items-center gap-10">

        {/* Magnetic NEXUS letters */}
        <div
          className="flex select-none"
          style={{ gap: '0.02em' }}
          aria-label="NEXUS"
        >
          {'NEXUS'.split('').map((char, i) => (
            <MagneticLetter key={i} char={char} index={i} />
          ))}
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={mounted ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ delay: 0.9, duration: 0.9, ease: 'easeOut' }}
          className="flex flex-col items-center gap-5"
        >

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/nexus_logo.svg"
              alt="NEXUS logo"
              width={56}
              height={56}
              style={{ objectFit: 'contain' }}
            />
          </motion.div>

        </motion.div>

      </div>

      {/* Scroll indicator  */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <span className="font-mono text-label tracking-[0.3em] text-subtle uppercase">
          Scroll
        </span>
        {/* Animated scroll line */}
        <div className="relative w-px h-12 bg-border overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent via-gold to-transparent"
            style={{ height: '40%' }}
            animate={{ y: ['0%', '250%'] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 0.4,
            }}
          />
        </div>
      </motion.div>

    </section>
  )
}