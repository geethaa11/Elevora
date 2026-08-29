import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import logoImg from '../../assets/logo.jpg';

export function Logo({ className, size = 'md', hideText = false, fullLockup = false }) {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16'
  };

  if (fullLockup) {
    return (
      <div className={cn("flex flex-col items-center text-center", className)}>
        <img 
          src={logoImg} 
          alt="Elevora Full Logo" 
          className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] object-contain drop-shadow-[0_0_30px_rgba(184,134,11,0.2)] mix-blend-screen"
        />
      </div>
    );
  }

  return (
    <Link to="/" className={cn("flex items-center transition-opacity hover:opacity-90", className)}>
      <img 
        src={logoImg} 
        alt="Elevora Logo" 
        className={cn("w-auto object-contain mix-blend-screen", sizes[size])}
      />
    </Link>
  );
}
