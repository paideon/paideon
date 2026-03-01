// **Entrance animation** — letters now arrive with a blur that clears as they land. `filter: blur(8px)` → `blur(0px)`. Feels like letters materializing out of darkness rather than just fading in.

// **Rotation on displacement** — when repelled, the letter tilts slightly in the opposite direction. Like a physical object being pushed — it doesn't just move, it reacts with its whole body.

// **Spring mass** — added `mass: 0.8` to the spring config. This gives the letters a sense of physical weight. Without mass, springs feel weightless and digital. With mass, they feel like they have substance.

// **Stroke colors** — at rest `#3d4659` (your `--foreground-subtle`), near cursor `#c9a84c` (your `--gold`). The gold appears only when the cursor is close, making the cursor interaction feel like it's illuminating the letters.

// ---

// ## How to Use It

// ```tsx
// // In HeroSection.tsx
// <div className="flex" style={{ gap: '0.02em' }}>
//   {'NEXUS'.split('').map((char, i) => (
//     <MagneticLetter key={i} char={char} index={i} />
//   ))}
// </div>
// ```

'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticLetterProps {
  char: string
  index: number
}

export function MagneticLetter({ char, index }: MagneticLetterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [isNear, setIsNear] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  // Raw motion values — updated directly on mousemove for performance
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useMotionValue(0)

  // Spring physics — gives each letter weight and resistance
  // stiffness = snap speed, damping = bounce reduction, mass = heaviness
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.8 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.8 })
  const springRotate = useSpring(rotate, { stiffness: 200, damping: 20 })

  useEffect(() => {
    // Small delay before entrance animation triggers
    const timer = setTimeout(() => setHasLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Magnetic field radius — how far the letter reacts
      const maxDist = 180

      if (distance < maxDist) {
        // Force grows exponentially as cursor gets closer
        const force = ((maxDist - distance) / maxDist) ** 2

        // Letter repels away from cursor
        x.set(-(dx / distance) * force * 68)
        y.set(-(dy / distance) * force * 48)

        // Slight rotation — letter tilts away from cursor direction
        rotate.set((dx / distance) * force * -6)

        setIsNear(true)
      } else {
        x.set(0)
        y.set(0)
        rotate.set(0)
        setIsNear(false)
      }
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
      rotate.set(0)
      setIsNear(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [x, y, rotate])

  return (
    <motion.span
      ref={ref}
      initial={{
        opacity: 0,
        y: 60,
        filter: 'blur(8px)',
      }}
      animate={
        hasLoaded
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : {}
      }
      transition={{
        delay: 0.1 * index,
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        x: springX,
        y: springY,
        rotateZ: springRotate,
        display: 'block',
        lineHeight: 1,
        userSelect: 'none',
        color: 'transparent',
        WebkitTextStroke: isNear ? '1px #c9a84c' : '1px #3d4659',
        transition: '-webkit-text-stroke-color 0.3s ease',
        fontFamily: 'var(--font-display)',
        fontWeight: 300,
      }}
    >
      {char}
    </motion.span>
  )
}