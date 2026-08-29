import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import GoldenParticles from './GoldenParticles.jsx'
import SectionLabel from './SectionLabel.jsx'
import TiltCard from './TiltCard.jsx'
import { PrimaryButton } from './GoldenButton.jsx'
import { teamMembers } from '../data/teamMembers.js'

const positions = [
  'top-0 left-0',
  'top-0 right-0',
  'bottom-0 left-0',
  'bottom-0 right-0',
]

export default function TeamBuilderSection() {
  return (
    <section id="build" className="relative overflow-hidden">
      <GoldenParticles density={30} className="opacity-60" />
      <div className="section-shell grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
        >
          <SectionLabel>Build Better Together</SectionLabel>
          <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
            Find your dream
            <br />
            team with AI
          </h2>
          <p className="mt-5 max-w-md text-light/60">
            We match you with the most compatible teammates based on skills, interests and
            goals.
          </p>
          <div className="mt-8">
            <PrimaryButton href="#build">
              Find Teammates <ArrowRight size={18} />
            </PrimaryButton>
          </div>
        </motion.div>

        <div className="relative mx-auto h-[380px] w-full max-w-[440px]">
          {/* connecting lines */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 440 380" aria-hidden="true">
            <line x1="220" y1="190" x2="70" y2="55" stroke="#B8860B" strokeOpacity="0.3" />
            <line x1="220" y1="190" x2="370" y2="55" stroke="#B8860B" strokeOpacity="0.3" />
            <line x1="220" y1="190" x2="70" y2="325" stroke="#B8860B" strokeOpacity="0.3" />
            <line x1="220" y1="190" x2="370" y2="325" stroke="#B8860B" strokeOpacity="0.3" />
          </svg>

          {/* central hexagon node */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="absolute h-full w-full animate-spin-slower" aria-hidden="true">
              <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" fill="none" stroke="#B8860B" strokeOpacity="0.5" />
              <polygon points="50,20 78,35 78,65 50,80 22,65 22,35" fill="none" stroke="#F0C048" strokeOpacity="0.6" />
            </svg>
            <div className="h-6 w-6 rounded-full bg-gold shadow-[0_0_30px_10px_rgba(184,134,11,0.5)]" />
          </motion.div>

          {teamMembers.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={`absolute w-36 animate-drift ${positions[i]}`}
              style={{ animationDuration: `${8 + i}s` }}
            >
              <TiltCard className="flex items-center gap-2.5 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ai-gradient text-xs font-semibold text-white">
                  {m.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">{m.name}</p>
                  <p className="truncate text-[10px] text-light/50">{m.role}</p>
                  <div className="mt-0.5 flex items-center gap-1">
                    <Star size={10} className="fill-gold text-gold" />
                    <span className="text-[10px] text-light/60">{m.rating}</span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
