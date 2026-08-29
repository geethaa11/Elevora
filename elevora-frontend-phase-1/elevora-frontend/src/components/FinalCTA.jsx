import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import GoldenParticles from './GoldenParticles.jsx'
import SectionLabel from './SectionLabel.jsx'
import { PrimaryButton } from './GoldenButton.jsx'

export default function FinalCTA() {
  return (
    <section id="join" className="relative flex min-h-[85vh] items-end overflow-hidden bg-background">
      <GoldenParticles density={70} />

      {/* glowing planet */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[8%] h-[420px] w-[420px] -translate-x-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle at 40% 35%, rgba(240,192,72,0.35), rgba(184,134,11,0.08) 55%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[14%] h-[220px] w-[220px] -translate-x-1/2 rounded-full border border-gold/20"
        style={{ boxShadow: '0 0 90px 20px rgba(184,134,11,0.15)' }}
      />

      {/* city skyline silhouette */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full opacity-70"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 24 }).map((_, i) => {
          const w = 30 + (i % 5) * 10
          const h = 40 + ((i * 37) % 140)
          const x = i * 62
          return <rect key={i} x={x} y={220 - h} width={w} height={h} fill="#0D0D0F" stroke="#B8860B" strokeOpacity="0.15" />
        })}
      </svg>

      {/* silhouette figure */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-16 left-1/2 h-40 -translate-x-1/2 opacity-90"
        viewBox="0 0 60 140"
      >
        <ellipse cx="30" cy="132" rx="26" ry="6" fill="#B8860B" opacity="0.15" />
        <circle cx="30" cy="18" r="10" fill="#0D0D0F" />
        <path d="M30 28c-10 0-16 8-16 20v40c0 6 4 10 8 10h16c4 0 8-4 8-10V48c0-12-6-20-16-20z" fill="#0D0D0F" />
        <rect x="18" y="96" width="8" height="34" fill="#0D0D0F" />
        <rect x="34" y="96" width="8" height="34" fill="#0D0D0F" />
      </svg>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-2xl px-6 pb-24 text-center"
      >
        <SectionLabel>Ready To Build The Future?</SectionLabel>
        <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
          Your journey starts now.
          <br />
          Let&rsquo;s elevate together.
        </h2>
        <div className="mt-9">
          <PrimaryButton to="/login">
            Join Elevora <ArrowRight size={18} />
          </PrimaryButton>
        </div>
      </motion.div>
    </section>
  )
}
