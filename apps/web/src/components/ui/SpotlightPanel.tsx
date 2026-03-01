// `SpotlightPanel` — each panel tracks the mouse position independently. A large soft radial gradient follows the cursor with spring physics, creating the feeling of a torch illuminating the content. It fades in on hover and fades out when the mouse leaves. The gold tint is very subtle — `6% opacity` — enough to feel but not enough to see consciously.

'use client'

import { useRef, useState} from "react"
import { useSpring, useMotionValue, useTransform, motion} from "framer-motion"

export function SpotlightPanel({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const spotX = useSpring(mouseX, { stiffness: 80, damping: 20 })
  const spotY = useSpring(mouseY, { stiffness: 80, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100)
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <motion.div
      ref={panelRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight gradient that follows mouse */}
      <motion.div
        className="absolute pointer-events-none z-0 transition-opacity duration-500"
        style={{
          width: '60%',
          paddingBottom: '60%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          top: useTransform(spotY, (v) => `${v}%`),
          left: useTransform(spotX, (v) => `${v}%`),
          transform: 'translate(-50%, -50%)',
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </motion.div>
  )
}