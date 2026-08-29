import React from 'react';
import { cn } from '../../lib/utils';

export function LogoMark({ className }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(184,134,11,0.6)]">
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE08B" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>
          {/* Sparkle path */}
          <g id="sparkle">
            <path d="M0,-5 Q0,0 5,0 Q0,0 0,5 Q0,0 -5,0 Q0,0 0,-5 Z" fill="url(#gold-grad)" />
          </g>
        </defs>
        
        {/* Sparkle 1: Lower-left near circuit lines */}
        <use href="#sparkle" x="15" y="75" transform="scale(0.8) translate(5, 10)" />
        
        {/* Sparkle 2: Right near the 'A' */}
        <use href="#sparkle" x="105" y="25" transform="scale(1.2)" />

        {/* Circuit lines branching to the left */}
        <g stroke="url(#gold-grad)" fill="none" strokeWidth="1.5">
          {/* Top branch */}
          <path d="M45,35 L25,35 L20,30" />
          <circle cx="20" cy="30" r="2" />
          
          {/* Middle branch */}
          <path d="M40,55 L20,55 L15,60" />
          <circle cx="15" cy="60" r="2" />
          
          {/* Bottom branch */}
          <path d="M45,75 L30,75 L25,80" />
          <circle cx="25" cy="80" r="2" />
        </g>

        {/* EA Ligature Monogram */}
        <g fill="url(#gold-grad)">
          {/* Using text elements with standard and cursive fallbacks to ensure typographic quality */}
          <text x="40" y="78" fontFamily="'DM Serif Display', Georgia, serif" fontSize="70">E</text>
          <text x="65" y="78" fontFamily="'Brush Script MT', 'Lucida Handwriting', cursive" fontSize="75">A</text>
        </g>
        
      </svg>
    </div>
  );
}
