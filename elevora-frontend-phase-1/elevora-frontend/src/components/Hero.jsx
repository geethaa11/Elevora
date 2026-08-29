import { motion, useMotionValue, useTransform } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import GoldenParticles from './GoldenParticles.jsx'
import { PrimaryButton, SecondaryButton } from './GoldenButton.jsx'

function CircuitIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M20 12h22M20 12v40M20 12 8 4M20 32h20M20 32 8 32M20 52h22M20 52 8 60"
        stroke="#B8860B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="4" r="2.5" fill="#F0C048" />
      <circle cx="8" cy="32" r="2.5" fill="#F0C048" />
      <circle cx="8" cy="60" r="2.5" fill="#F0C048" />
      <circle cx="20" cy="12" r="2" fill="#F0C048" />
      <circle cx="20" cy="32" r="2" fill="#F0C048" />
      <circle cx="20" cy="52" r="2" fill="#F0C048" />
    </svg>
  )
}

export default function Hero() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const parallaxX = useTransform(mx, [-1, 1], [-12, 12])
  const parallaxY = useTransform(my, [-1, 1], [-8, 8])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1)
  }

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background pt-24"
    >
      {/* asteroid field */}
      <div aria-hidden="true" className="absolute inset-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full border border-gold/20 bg-dark-secondary/60 animate-drift"
            style={{
              width: `${6 + (i % 4) * 4}px`,
              height: `${6 + (i % 4) * 4}px`,
              top: `${10 + ((i * 37) % 70)}%`,
              left: `${5 + ((i * 53) % 90)}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${10 + (i % 5) * 2}s`,
              opacity: 0.35,
            }}
          />
        ))}
      </div>

      <GoldenParticles density={90} />

      {/* orbital trail arcs */}
      <motion.svg
        style={{ x: parallaxX, y: parallaxY }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 1440 900"
        fill="none"
      >
        <ellipse cx="1250" cy="180" rx="480" ry="140" stroke="url(#trail1)" strokeWidth="1" className="animate-spin-slow" style={{ transformOrigin: '1250px 180px' }} />
        <ellipse cx="200" cy="650" rx="360" ry="110" stroke="url(#trail2)" strokeWidth="1" className="animate-spin-slower" style={{ transformOrigin: '200px 650px' }} />
        <defs>
          <linearGradient id="trail1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B8860B" stopOpacity="0" />
            <stop offset="50%" stopColor="#F0C048" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#B8860B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="trail2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B8860B" stopOpacity="0" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#B8860B" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* content */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-4"
        >
          <CircuitIcon />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-6xl tracking-[0.12em] text-white sm:text-7xl md:text-8xl"
        >
          ELEVORA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-5 text-lg text-light sm:text-xl"
        >
          Your AI co-founder for every hackathon
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-4 max-w-xl text-sm text-light/60 sm:text-base"
        >
          Discover opportunities. Validate ideas. Find teammates.
          <br />
          Get mentorship. Build winning projects.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <PrimaryButton to="/login">
            Get Started <ArrowRight size={18} />
          </PrimaryButton>
          <SecondaryButton href="#discover">
            Explore More <Play size={14} />
          </SecondaryButton>
        </motion.div>
      </div>

      {/* golden horizon glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 100%, rgba(184,134,11,0.35) 0%, rgba(184,134,11,0.08) 45%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
      />
    </section>
  )
}
