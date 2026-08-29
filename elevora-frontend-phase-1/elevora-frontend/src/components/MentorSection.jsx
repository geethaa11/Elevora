import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Star, BadgeCheck } from 'lucide-react'
import GoldenParticles from './GoldenParticles.jsx'
import SectionLabel from './SectionLabel.jsx'
import TiltCard from './TiltCard.jsx'
import { PrimaryButton } from './GoldenButton.jsx'
import { mentors } from '../data/mentors.js'

export default function MentorSection() {
  return (
    <section id="grow" className="relative overflow-hidden">
      <GoldenParticles density={30} className="opacity-60" />
      <div id="mentors" className="section-shell">
        <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
          >
            <SectionLabel>Learn From The Best</SectionLabel>
            <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
              Get mentored by
              <br />
              industry experts
            </h2>
            <p className="mt-5 max-w-md text-light/60">
              Connect with verified mentors, book 1:1 sessions, attend live Q&As and level up
              your journey.
            </p>
            <div className="mt-8">
              <PrimaryButton href="#mentors">
                Explore Mentors <ArrowRight size={18} />
              </PrimaryButton>
            </div>
          </motion.div>

          <div className="relative flex items-center justify-center gap-3">
            <button
              className="cursor-interactive hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-light/50 transition-colors hover:border-gold hover:text-gold sm:flex"
              aria-label="Previous mentor"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
              {mentors.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className={m.featured ? 'sm:-translate-y-3' : ''}
                >
                  <TiltCard
                    className={`flex h-full flex-col items-center p-5 text-center ${
                      m.featured
                        ? 'border-gold shadow-gold-lg'
                        : ''
                    }`}
                  >
                    <div className="relative mb-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ai-gradient text-sm font-semibold text-white">
                        {m.initials}
                      </div>
                      {m.featured && (
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-dark">
                          <BadgeCheck size={12} />
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white">{m.name}</p>
                    <p className="mt-0.5 text-xs text-light/50">{m.title}</p>
                    <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-light/50">
                      <span className="flex items-center gap-1">
                        <Star size={11} className="fill-gold text-gold" /> {m.rating} ({m.reviews})
                      </span>
                      <span>&middot;</span>
                      <span>{m.sessions}</span>
                    </div>
                    <div className="mt-4 w-full">
                      <PrimaryButton className="!w-full !py-2.5 text-xs">Book Session</PrimaryButton>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>

            <button
              className="cursor-interactive hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-light/50 transition-colors hover:border-gold hover:text-gold sm:flex"
              aria-label="Next mentor"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
