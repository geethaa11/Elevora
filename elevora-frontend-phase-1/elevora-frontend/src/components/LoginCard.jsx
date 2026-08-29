import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PrimaryButton } from './GoldenButton.jsx'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.5 0 12.3c0 5.44 3.44 10.05 8.21 11.68.6.12.82-.27.82-.6 0-.29-.01-1.06-.02-2.08-3.34.75-4.04-1.66-4.04-1.66-.55-1.43-1.34-1.82-1.34-1.82-1.09-.77.08-.75.08-.75 1.2.09 1.84 1.26 1.84 1.26 1.07 1.88 2.8 1.34 3.49 1.02.11-.8.42-1.34.76-1.65-2.67-.31-5.47-1.38-5.47-6.13 0-1.36.47-2.46 1.24-3.33-.12-.31-.54-1.57.12-3.28 0 0 1.01-.33 3.3 1.27a11.2 11.2 0 0 1 6.01 0c2.29-1.6 3.3-1.27 3.3-1.27.66 1.71.24 2.97.12 3.28.77.87 1.24 1.97 1.24 3.33 0 4.76-2.81 5.81-5.49 6.12.43.38.81 1.13.81 2.29 0 1.65-.02 2.98-.02 3.39 0 .33.22.72.83.6C20.57 22.34 24 17.73 24 12.3 24 5.5 18.63 0 12 0z" />
    </svg>
  )
}

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="cursor-interactive relative w-full max-w-md rounded-3xl border border-gold/40 bg-surface/70 p-8 shadow-gold backdrop-blur-md sm:p-10"
    >
      <h1 className="font-display text-3xl text-white sm:text-4xl">Welcome back</h1>
      <p className="mt-2 text-sm text-light/60">Enter your journey where you left off.</p>

      <form
        className="mt-8 flex flex-col gap-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-medium text-light/70">
            Email
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-dark-secondary/70 px-4 py-3 transition-all duration-300 focus-within:border-gold focus-within:shadow-gold-sm">
            <Mail size={16} className="text-light/40" />
            <input
              id="email"
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
              className="w-full bg-transparent text-sm text-light placeholder:text-light/30 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-medium text-light/70">
              Password
            </label>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-dark-secondary/70 px-4 py-3 transition-all duration-300 focus-within:border-gold focus-within:shadow-gold-sm">
            <Lock size={16} className="text-light/40" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••"
              autoComplete="current-password"
              className="w-full bg-transparent text-sm text-light placeholder:text-light/30 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="cursor-interactive shrink-0 text-light/40 hover:text-gold"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="mt-2 text-right">
            <a href="#forgot-password" className="cursor-interactive group relative text-xs text-gold">
              Forgot password?
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          </div>
        </div>

        <PrimaryButton type="submit" className="mt-2 !w-full">
          Continue <ArrowRight size={18} />
        </PrimaryButton>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] uppercase tracking-widest text-light/40">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="cursor-interactive flex items-center justify-center gap-3 rounded-xl border border-border bg-dark-secondary/50 py-3 text-sm text-light transition-all duration-300 hover:border-gold/60 hover:bg-dark-secondary hover:shadow-gold-sm"
        >
          <GoogleIcon /> Continue with Google
        </button>
        <button
          type="button"
          className="cursor-interactive flex items-center justify-center gap-3 rounded-xl border border-border bg-dark-secondary/50 py-3 text-sm text-light transition-all duration-300 hover:border-gold/60 hover:bg-dark-secondary hover:shadow-gold-sm"
        >
          <GitHubIcon /> Continue with GitHub
        </button>
      </div>

      <p className="mt-7 text-center text-xs text-light/50">
        New here?{' '}
        <Link to="/login" className="cursor-interactive group relative text-gold">
          Sign up
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
        </Link>
      </p>
    </motion.div>
  )
}
