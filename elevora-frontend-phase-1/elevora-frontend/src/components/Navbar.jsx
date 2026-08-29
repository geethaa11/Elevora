import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo.jsx'
import { PrimaryButton } from './GoldenButton.jsx'

const LINKS = [
  { label: 'Features', href: '#discover' },
  { label: 'How It Works', href: '#build' },
  { label: 'For Students', href: '#grow' },
  { label: 'Mentors', href: '#mentors' },
  { label: 'About Us', href: '#join' },
]

function NavLink({ label, href, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="cursor-interactive group relative text-sm text-light/80 transition-colors duration-300 hover:text-gold"
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_8px_#B8860B]" />
    </a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-border/80 bg-background/80 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-12">
        <Logo />

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.label} {...l} />
          ))}
        </div>

        <div className="hidden md:block">
          <PrimaryButton to="/login" className="!px-6 !py-2.5 text-sm">
            Get Started
          </PrimaryButton>
        </div>

        <button
          className="cursor-interactive text-light md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-5 px-6 py-6">
              {LINKS.map((l) => (
                <NavLink key={l.label} {...l} onClick={() => setMenuOpen(false)} />
              ))}
              <PrimaryButton to="/login" className="mt-2 w-full">
                Get Started
              </PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
