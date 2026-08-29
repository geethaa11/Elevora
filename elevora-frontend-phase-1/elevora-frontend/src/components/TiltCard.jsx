import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Wraps children in a card that lifts, gains a gold glow, and tilts very
 * slightly toward the cursor on hover. Tilt is intentionally subtle
 * (a few degrees max) so it reads as premium rather than gimmicky.
 */
export default function TiltCard({ children, className = '', tiltStrength = 6, ...props }) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 20 })
  const sry = useSpring(ry, { stiffness: 200, damping: 20 })
  const rotateX = useTransform(srx, (v) => `${v}deg`)
  const rotateY = useTransform(sry, (v) => `${v}deg`)

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    ry.set(px * tiltStrength)
    rx.set(-py * tiltStrength)
  }

  const handleLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ y: -7 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`group cursor-interactive rounded-2xl border border-border bg-surface/80 backdrop-blur-sm transition-shadow duration-300 hover:border-gold/60 hover:shadow-gold ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
