import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
// Note: assuming logo will be placed in src/assets/logo.png
import logoImg from '../../assets/logo.png';

export function Logo({ className, size = 'md', hideText = false }) {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12'
  };

  return (
    <Link to="/" className={cn("flex items-center gap-2 transition-opacity hover:opacity-90", className)}>
      <img 
        src={logoImg} 
        alt="Elevora Logo" 
        className={cn("w-auto object-contain", sizes[size])}
        // Fallback styling just in case the image fails to load during scaffolding
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div className="hidden h-8 w-8 items-center justify-center rounded bg-primary text-neutral-900 font-display font-bold text-lg">
        EA
      </div>
      {!hideText && (
        <span className="font-display text-xl font-bold tracking-wide text-neutral-50">
          Elevora
        </span>
      )}
    </Link>
  );
}
