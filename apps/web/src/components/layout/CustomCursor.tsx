'use client'

import { useEffect } from 'react'
import { useMousePosition } from '@/hooks/useMousePosition'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const { x, y } = useMousePosition()
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Dot snaps instantly
  const dotX = useSpring(cursorX, { stiffness: 800, damping: 40 })
  const dotY = useSpring(cursorY, { stiffness: 800, damping: 40 })

  // Ring follows with lag — gives the trailing feel
  const ringX = useSpring(cursorX, { stiffness: 120, damping: 18 })
  const ringY = useSpring(cursorY, { stiffness: 120, damping: 18 })

  useEffect(() => {
    cursorX.set(x)
    cursorY.set(y)
  }, [x, y, cursorX, cursorY])

  return (
    <>
      {/* Outer ring — lags behind */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div className="w-9 h-9 rounded-full border border-white/30" />
      </motion.div>

      {/* Inner dot — snaps to cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </motion.div>
    </>
  )
}