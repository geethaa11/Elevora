export default function GlobeVisual({ className = '' }) {
  return (
    <svg viewBox="0 0 400 400" className={`animate-spin-slower ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id="globeFill2" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#2C2C34" />
          <stop offset="60%" stopColor="#151517" />
          <stop offset="100%" stopColor="#0D0D0F" />
        </radialGradient>
        <radialGradient id="globeGlow2" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="rgba(184,134,11,0)" />
          <stop offset="100%" stopColor="rgba(184,134,11,0.25)" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="150" fill="url(#globeFill2)" stroke="#B8860B" strokeOpacity="0.25" />
      <circle cx="200" cy="200" r="150" fill="url(#globeGlow2)" />
      {[30, 60, 90, 120].map((rx, i) => (
        <ellipse key={i} cx="200" cy="200" rx={rx} ry="150" fill="none" stroke="#B8860B" strokeOpacity="0.15" />
      ))}
      <ellipse cx="200" cy="200" rx="150" ry="40" fill="none" stroke="#B8860B" strokeOpacity="0.15" />
      <ellipse cx="200" cy="200" rx="150" ry="90" fill="none" stroke="#B8860B" strokeOpacity="0.15" />
      {[
        [140, 130], [230, 110], [270, 190], [160, 250], [120, 200], [250, 260],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#F0C048">
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${3 + i}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <ellipse cx="200" cy="200" rx="190" ry="60" fill="none" stroke="#B8860B" strokeOpacity="0.4" strokeWidth="1" />
      <ellipse cx="200" cy="200" rx="175" ry="90" fill="none" stroke="#B8860B" strokeOpacity="0.25" strokeWidth="1" transform="rotate(20 200 200)" />
    </svg>
  )
}
