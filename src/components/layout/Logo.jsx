import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function Logo({ className, size = 'md', hideText = false, fullLockup = false }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl sm:text-7xl'
  };

  const CircuitE = ({ className }) => (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(184,134,11,0.6)]">
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE08B" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>
        </defs>
        
        {/* The 'E' */}
        <path d="M45,15 L85,15 L85,25 L58,25 L58,45 L80,45 L80,55 L58,55 L58,75 L85,75 L85,85 L45,85 Z" fill="url(#gold-grad)" />
        
        {/* Circuit lines on the left */}
        {/* Line 1 */}
        <path d="M45,30 L25,30" stroke="url(#gold-grad)" strokeWidth="2" fill="none" />
        <circle cx="23" cy="30" r="2.5" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" />
        
        {/* Line 2 */}
        <path d="M45,40 L15,40 L10,35" stroke="url(#gold-grad)" strokeWidth="2" fill="none" />
        <circle cx="8" cy="33" r="2.5" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" />
        
        {/* Line 3 */}
        <path d="M45,50 L20,50" stroke="url(#gold-grad)" strokeWidth="2" fill="none" />
        <circle cx="18" cy="50" r="2.5" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" />
        
        {/* Line 4 */}
        <path d="M45,60 L30,60 L25,65" stroke="url(#gold-grad)" strokeWidth="2" fill="none" />
        <circle cx="23" cy="67" r="2.5" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" />
        
        {/* Line 5 */}
        <path d="M45,70 L15,70" stroke="url(#gold-grad)" strokeWidth="2" fill="none" />
        <circle cx="13" cy="70" r="2.5" fill="none" stroke="url(#gold-grad)" strokeWidth="1.5" />

        {/* Inner circuit details */}
        <circle cx="50" cy="20" r="1.5" fill="#000" />
        <circle cx="50" cy="50" r="1.5" fill="#000" />
        <circle cx="50" cy="80" r="1.5" fill="#000" />
      </svg>
    </div>
  );

  if (fullLockup) {
    return (
      <div className={cn("flex flex-col items-center text-center", className)}>
        <CircuitE className={cn("mb-6", sizes.xl)} />
        
        {/* ELEVORA Wordmark */}
        <h1 className={cn("font-display font-normal tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6 drop-shadow-md", textSizes.xl)}>
          ELEVORA
        </h1>
        
        {/* Tagline */}
        <p className="text-xl sm:text-2xl text-neutral-200 font-medium font-display tracking-wide drop-shadow-md">
          Your AI co-founder for every hackathon
        </p>
      </div>
    );
  }

  return (
    <Link to="/" className={cn("flex items-center gap-3 transition-opacity hover:opacity-90", className)}>
      <CircuitE className={sizes[size]} />
      {!hideText && (
        <span className={cn("font-display font-normal tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 uppercase", textSizes[size])}>
          Elevora
        </span>
      )}
    </Link>
  );
}
