import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import GlobeVisual from '../components/GlobeVisual.jsx'
import GoldenParticles from '../components/GoldenParticles.jsx'
import LoginCard from '../components/LoginCard.jsx'

const STEPS = [
  { num: '01', label: 'Discover' },
  { num: '02', label: 'Validate' },
  { num: '03', label: 'Connect' },
  { num: '04', label: 'Build' },
  { num: '05', label: 'Elevate' },
]

function LoginProgressRail() {
  return (
    <div className="relative hidden flex-col gap-9 lg:flex">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />
      {STEPS.map((s, i) => {
        const active = i === 0
        return (
          <div key={s.num} className="relative z-10 flex items-center gap-3">
            <span
              className={`h-[15px] w-[15px] shrink-0 rounded-full border ${
                active
                  ? 'border-gold bg-gold shadow-[0_0_14px_3px_rgba(184,134,11,0.7)]'
                  : 'border-border bg-background'
              }`}
            />
            <span className={`flex flex-col leading-tight ${active ? 'text-gold' : 'text-light/40'}`}>
              <span className="text-[10px] font-semibold tracking-widest">{s.num}</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest">{s.label}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <GoldenParticles density={70} />

      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10">
        <Logo />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <a
            href="/"
            className="cursor-interactive group flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-light/70 transition-all duration-300 hover:border-gold hover:text-gold hover:shadow-gold-sm"
          >
            <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to home
          </a>
        </motion.div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-16 px-6 pb-16 pt-6 sm:px-10 lg:grid-cols-[auto_1fr_auto] lg:gap-10">
        <LoginProgressRail />

        <div className="flex flex-col items-center lg:items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="relative h-[280px] w-[280px] sm:h-[380px] sm:w-[380px]"
          >
            <GlobeVisual className="h-full w-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-4 text-center lg:text-left"
          >
            <p className="font-display text-2xl leading-snug text-white sm:text-3xl">
              Your <span className="text-gold">AI</span> co-founder
              <br />
              for every <span className="text-gold">hackathon</span>.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 lg:justify-start">
              <span className="h-px w-10 bg-gold/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_2px_rgba(184,134,11,0.7)]" />
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <LoginCard />
        </div>
      </main>

      <footer className="relative z-10 px-6 pb-6 text-center sm:px-10 sm:text-left">
        <p className="text-xs text-light/30">&copy; 2026 Elevora. All rights reserved.</p>
      </footer>
    </div>
  )
}
