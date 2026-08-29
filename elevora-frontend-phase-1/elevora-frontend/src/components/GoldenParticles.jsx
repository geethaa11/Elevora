import { useEffect, useRef } from 'react'

/**
 * Lightweight canvas particle field: tiny warm-gold specks that vary in
 * size/opacity, drift slowly, occasionally twinkle, and nudge gently
 * toward the cursor. Density is tunable per-section so the effect never
 * competes with foreground content.
 *
 * Kept off the DOM (single <canvas>) and off React re-renders — all motion
 * lives inside one requestAnimationFrame loop for performance.
 */
export default function GoldenParticles({ density = 60, className = '', reactToCursor = true }) {
  const canvasRef = useRef(null)
  const pointerRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width, height, dpr
    let particles = []
    let rafId
    let frame = 0

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
      initParticles()
    }

    const initParticles = () => {
      const count = Math.round((width * height) / 18000) * (density / 60)
      particles = Array.from({ length: Math.max(8, Math.round(count)) }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        baseOpacity: Math.random() * 0.5 + 0.15,
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.15,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        twinklePhase: Math.random() * Math.PI * 2,
        stationary: Math.random() < 0.35,
      }))
    }

    const handlePointer = (e) => {
      const rect = canvas.getBoundingClientRect()
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const draw = () => {
      frame++
      ctx.clearRect(0, 0, width, height)
      const { x: px, y: py } = pointerRef.current

      for (const p of particles) {
        if (!p.stationary) {
          p.x += p.driftX
          p.y += p.driftY
          if (p.x < -5) p.x = width + 5
          if (p.x > width + 5) p.x = -5
          if (p.y < -5) p.y = height + 5
          if (p.y > height + 5) p.y = -5
        }

        let drawX = p.x
        let drawY = p.y

        if (reactToCursor && px > -100) {
          const dx = p.x - px
          const dy = p.y - py
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const force = (1 - dist / 120) * 6
            drawX += (dx / (dist || 1)) * force
            drawY += (dy / (dist || 1)) * force
          }
        }

        const twinkle = prefersReducedMotion
          ? p.baseOpacity
          : p.baseOpacity + Math.sin(frame * p.twinkleSpeed + p.twinklePhase) * 0.25

        ctx.beginPath()
        ctx.fillStyle = `rgba(240, 192, 72, ${Math.max(0, twinkle)})`
        ctx.shadowColor = 'rgba(184, 134, 11, 0.8)'
        ctx.shadowBlur = p.r * 3
        ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(draw)
      }
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    if (reactToCursor) window.addEventListener('mousemove', handlePointer, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handlePointer)
    }
  }, [density, reactToCursor])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  )
}
