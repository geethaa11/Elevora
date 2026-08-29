import { useEffect, useState } from 'react'
import { MousePointer2 } from 'lucide-react'

const SECTIONS = [
  { id: 'home', num: '01', label: 'Home' },
  { id: 'discover', num: '02', label: 'Discover' },
  { id: 'build', num: '03', label: 'Build' },
  { id: 'grow', num: '04', label: 'Grow' },
  { id: 'join', num: '05', label: 'Join Us' },
]

export default function ScrollProgressRail() {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    )

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 lg:flex lg:flex-col lg:items-center">
      <div className="relative flex flex-col gap-10">
        {/* connecting line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />

        {SECTIONS.map((s) => {
          const isActive = active === s.id
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="cursor-interactive group relative z-10 flex items-center gap-3 text-left"
              aria-label={`Go to ${s.label} section`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span
                className={`h-[15px] w-[15px] shrink-0 rounded-full border transition-all duration-300 ${
                  isActive
                    ? 'border-gold bg-gold shadow-[0_0_14px_3px_rgba(184,134,11,0.7)]'
                    : 'border-border bg-background group-hover:border-gold/60'
                }`}
              />
              <span
                className={`flex flex-col leading-tight transition-colors duration-300 ${
                  isActive ? 'text-gold' : 'text-light/40 group-hover:text-light/70'
                }`}
              >
                <span className="text-[10px] font-semibold tracking-widest">{s.num}</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest">{s.label}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-2 text-light/40">
        <MousePointer2 size={14} className="animate-pulse-glow" />
        <span className="text-[9px] uppercase tracking-widest [writing-mode:vertical-rl]">Scroll to explore</span>
      </div>
    </div>
  )
}
