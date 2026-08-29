import { Link } from 'react-router-dom'

export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M20 16h20M20 16v32M20 16 12 10M20 32h16M20 32 12 32M20 48h20M20 48 12 54"
        stroke="#B8860B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2" fill="#F0C048" />
      <circle cx="12" cy="32" r="2" fill="#F0C048" />
      <circle cx="12" cy="54" r="2" fill="#F0C048" />
    </svg>
  )
}

export default function Logo({ size = 28, textSize = 'text-lg', to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 cursor-interactive" aria-label="Elevora home">
      <LogoMark size={size} />
      <span className={`font-display ${textSize} tracking-[0.15em] text-white`}>ELEVORA</span>
    </Link>
  )
}
