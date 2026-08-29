import Navbar from '../components/Navbar.jsx'
import ScrollProgressRail from '../components/ScrollProgressRail.jsx'
import Hero from '../components/Hero.jsx'
import HackathonSection from '../components/HackathonSection.jsx'
import ValidatorSection from '../components/ValidatorSection.jsx'
import TeamBuilderSection from '../components/TeamBuilderSection.jsx'
import MentorSection from '../components/MentorSection.jsx'
import FinalCTA from '../components/FinalCTA.jsx'
import Logo from '../components/Logo.jsx'

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <ScrollProgressRail />

      <main>
        <Hero />
        <HackathonSection />
        <ValidatorSection />
        <TeamBuilderSection />
        <MentorSection />
        <FinalCTA />
      </main>

      <footer className="border-t border-border bg-background px-6 py-8 text-center">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Logo size={22} textSize="text-sm" />
          <p className="text-xs text-light/40">&copy; 2026 Elevora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
