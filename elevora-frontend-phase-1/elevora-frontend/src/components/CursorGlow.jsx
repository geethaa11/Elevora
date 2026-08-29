import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * A small gold dot/ring that follows the cursor with spring-like easing,
 * gently intensifying over interactive elements. Disabled entirely on
 * touch devices so it never gets in the way of tapping.
 */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { damping: 28, stiffness: 300, mass: 0.4 })
  const springY = useSpring(y, { damping: 28, stiffness: 300, mass: 0.4 })

  const glowX = useSpring(x, { damping: 40, stiffness: 120, mass: 0.6 })
  const glowY = useSpring(y, { damping: 40, stiffness: 120, mass: 0.6 })

  const rafRef = useRef(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setEnabled(isFinePointer)
    if (!isFinePointer) return

    document.body.classList.add('cursor-glow-active')

    const handleMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)

      const target = e.target
      if (target?.closest?.('button, a, input, [role="button"], .cursor-interactive')) {
        setHovering(true)
      } else {
        setHovering(false)
      }
    }

    const handleLeave = () => setVisible(false)

    window.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseleave', handleLeave)

    return () => {
      document.body.classList.remove('cursor-glow-active')
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseleave', handleLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!enabled) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[999]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}
    >
      {/* Ambient soft glow, trails a little behind the ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: glowX,
          top: glowY,
          x: '-50%',
          y: '-50%',
          width: hovering ? 180 : 120,
          height: hovering ? 180 : 120,
          background: 'radial-gradient(circle, rgba(184,134,11,0.22) 0%, rgba(184,134,11,0) 70%)',
          transition: 'width 0.35s ease, height 0.35s ease',
        }}
      />
      {/* Precise gold ring/dot that tracks the pointer closely */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          width: hovering ? 34 : 18,
          height: hovering ? 34 : 18,
          borderColor: hovering ? '#F0C048' : 'rgba(184,134,11,0.8)',
          borderWidth: hovering ? 1.5 : 1,
          background: hovering ? 'rgba(184,134,11,0.12)' : 'transparent',
          boxShadow: hovering ? '0 0 24px rgba(240,192,72,0.5)' : '0 0 10px rgba(184,134,11,0.35)',
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
        }}
      />
    </div>
  )
}
