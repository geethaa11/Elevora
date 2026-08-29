import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LogoMark } from './LogoMark';

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

  if (fullLockup) {
    return (
      <div className={cn("flex flex-col items-center text-center", className)}>
        <LogoMark className={cn("mb-6", sizes.xl)} />
        
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
      <LogoMark className={sizes[size]} />
      {!hideText && (
        <span className={cn("font-display font-normal tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 uppercase", textSizes[size])}>
          Elevora
        </span>
      )}
    </Link>
  );
}
