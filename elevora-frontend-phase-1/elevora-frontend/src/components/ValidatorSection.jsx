import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Code2, Boxes, Users } from 'lucide-react'
import GoldenParticles from './GoldenParticles.jsx'
import SectionLabel from './SectionLabel.jsx'
import TiltCard from './TiltCard.jsx'
import { PrimaryButton } from './GoldenButton.jsx'

const features = ['AI User Auth', 'AI Chatbot', 'Analytics', 'Real-time Sync']

export default function ValidatorSection() {
  return (
    <section className="relative overflow-hidden">
      <GoldenParticles density={30} className="opacity-60" />
      <div className="section-shell grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="order-2 lg:order-1"
        >
          <SectionLabel>Validate. Improve. Innovate.</SectionLabel>
          <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
            Turn your ideas
            <br />
            into impactful solutions
          </h2>
          <p className="mt-5 max-w-md text-light/60">
            Get AI-powered insights on your ideas, competitor analysis, feasibility and
            recommended tech stack.
          </p>
          <div className="mt-8">
            <PrimaryButton href="#validate">
              Try AI Validator <ArrowRight size={18} />
            </PrimaryButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="order-1 lg:order-2"
          style={{ transformPerspective: 1200 }}
        >
          <TiltCard tiltStrength={4} className="relative p-5 shadow-gold sm:p-7">
            <div className="mb-5 flex items-center gap-2 text-light/70">
              <Sparkles size={16} className="text-gold" />
              <span className="text-sm font-medium">AI Validator</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatBox label="Innovation Score">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl text-gold">84</span>
                  <span className="text-xs text-light/40">/100</span>
                </div>
                <p className="mt-1 text-[11px] text-success">Excellent Potential</p>
              </StatBox>

              <StatBox label="Feasibility">
                <span className="font-display text-2xl text-success">High</span>
                <p className="mt-1 text-[11px] text-light/50">Great feasibility</p>
              </StatBox>

              <StatBox label="Tech Stack" className="col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5">
                  <TechDot color="#61DAFB" />
                  <TechDot color="#8B5CF6" />
                  <TechDot color="#3776AB" />
                  <span className="text-[11px] text-light/50">+2</span>
                </div>
              </StatBox>
            </div>

            <div className="mt-3 rounded-xl border border-border bg-dark-secondary/60 p-4">
              <p className="mb-2 text-[11px] uppercase tracking-widest text-light/40">
                Suggested Features
              </p>
              <div className="flex flex-wrap gap-2">
                {features.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-light/70"
                  >
                    <Boxes size={11} className="text-gold" /> {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-dark-secondary/60 p-4">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gold" />
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-light/40">
                    Competitor Analysis
                  </p>
                  <p className="text-xs text-light/70">2 Strong Competitors Found</p>
                </div>
              </div>
              <a href="#validate" className="cursor-interactive flex items-center gap-1 text-xs text-gold hover:underline">
                View Details <ArrowRight size={12} />
              </a>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-6 -bottom-6 h-24 bg-gold/10 blur-3xl"
            />
          </TiltCard>
        </motion.div>
      </div>
    </section>
  )
}

function StatBox({ label, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-border bg-dark-secondary/60 p-3.5 ${className}`}>
      <p className="mb-1.5 text-[10px] uppercase tracking-widest text-light/40">{label}</p>
      {children}
    </div>
  )
}

function TechDot({ color }) {
  return (
    <span
      className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface"
      style={{ boxShadow: `0 0 8px ${color}55` }}
    >
      <Code2 size={12} style={{ color }} />
    </span>
  )
}
