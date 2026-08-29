import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import GoldenParticles from './GoldenParticles.jsx'
import SectionLabel from './SectionLabel.jsx'
import TiltCard from './TiltCard.jsx'
import GlobeVisual from './GlobeVisual.jsx'
import { PrimaryButton } from './GoldenButton.jsx'
import { hackathons } from '../data/hackathons.js'

export default function HackathonSection() {
  return (
    <section id="discover" className="relative overflow-hidden">
      <GoldenParticles density={35} className="opacity-70" />
      <div className="section-shell grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
        >
          <SectionLabel>Discover Limitless Opportunities</SectionLabel>
          <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
            Find the right
            <br />
            hackathon for you
          </h2>
          <p className="mt-5 max-w-md text-light/60">
            Explore global hackathons curated for your interests. Never miss an opportunity that
            matches your passion.
          </p>
          <div className="mt-8">
            <PrimaryButton href="#discover">
              Explore Hackathons <ArrowRight size={18} />
            </PrimaryButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto h-[340px] w-[340px] sm:h-[400px] sm:w-[400px]"
        >
          <GlobeVisual className="h-full w-full" />

          <FloatingCard
            className="left-[-10%] top-[6%] sm:left-[-14%]"
            item={hackathons[0]}
            delay={0.1}
          />
          <FloatingCard
            className="right-[-8%] top-[2%] sm:right-[-16%]"
            item={hackathons[1]}
            delay={0.25}
          />
          <FloatingCard
            className="bottom-[2%] right-[4%] sm:right-[-6%]"
            item={hackathons[2]}
            delay={0.4}
          />
        </motion.div>
      </div>
    </section>
  )
}

function FloatingCard({ item, className, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`absolute w-40 animate-drift sm:w-48 ${className}`}
      style={{ animationDuration: '9s' }}
    >
      <TiltCard className="p-3 text-left sm:p-4">
        <p className="truncate text-xs font-semibold text-white sm:text-sm">{item.name}</p>
        <p className="mt-1 text-[10px] text-light/50 sm:text-xs">{item.tags}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] text-light/40">{item.metaLabel}</span>
          <span className="text-[10px] font-semibold text-gold sm:text-xs">{item.metaValue}</span>
        </div>
      </TiltCard>
    </motion.div>
  )
}
