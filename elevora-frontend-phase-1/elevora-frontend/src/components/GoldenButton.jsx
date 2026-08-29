import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const base =
  'cursor-interactive inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-shadow duration-300 select-none'

/**
 * Primary: solid gold background, dark text, light-sweep + glow on hover.
 * Secondary: outlined gold border, transparent/dark fill.
 */
export function PrimaryButton({ children, to, href, onClick, className = '', type = 'button', ...props }) {
  const content = (
    <motion.span
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`${base} relative overflow-hidden bg-gold-gradient px-7 py-3.5 text-dark shadow-gold-sm hover:shadow-gold-lg ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/25 [mask-image:linear-gradient(75deg,transparent_40%,white_50%,transparent_60%)] transition-transform duration-700 hover:translate-x-full" />
    </motion.span>
  )

  if (to) return <Link to={to}>{content}</Link>
  if (href) return <a href={href}>{content}</a>
  return (
    <button type={type} onClick={onClick} {...props}>
      {content}
    </button>
  )
}

export function SecondaryButton({ children, to, href, onClick, className = '', type = 'button', ...props }) {
  const content = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`${base} border border-border bg-transparent px-6 py-3.5 text-light hover:border-gold hover:text-gold hover:shadow-gold-sm hover:bg-white/[0.03] ${className}`}
    >
      {children}
    </motion.span>
  )

  if (to) return <Link to={to}>{content}</Link>
  if (href) return <a href={href}>{content}</a>
  return (
    <button type={type} onClick={onClick} {...props}>
      {content}
    </button>
  )
}
