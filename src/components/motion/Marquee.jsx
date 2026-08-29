import React from 'react';
import { useReducedMotion } from 'framer-motion';

export function Marquee() {
  const shouldReduceMotion = useReducedMotion();
  const text = "DON'T JUST PARTICIPATE, DOMINATE";
  const repeatCount = 10;
  
  const content = [...Array(repeatCount)].map((_, i) => (
    <span key={i} className="flex items-center text-xs font-mono tracking-[0.2em] text-[#B8860B] mx-4 shrink-0">
      {text}
      <span className="ml-8 mr-4 text-[8px] text-[#D4AF37]">✦</span>
    </span>
  ));

  if (shouldReduceMotion) {
    return (
      <div className="relative flex overflow-hidden border-y border-[#2C2C34]/50 bg-transparent py-3">
        <div className="flex whitespace-nowrap overflow-hidden">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex overflow-hidden border-y border-[#2C2C34]/50 bg-transparent py-3 group">
      <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] shrink-0">
        {content}
      </div>
      <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] shrink-0">
        {content}
      </div>
    </div>
  );
}
