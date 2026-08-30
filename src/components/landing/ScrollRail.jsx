import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const SECTIONS = [
  { id: 'home', label: '01', desc: 'HOME' },
  { id: 'discover', label: '02', desc: 'DISCOVER' },
  { id: 'build', label: '03', desc: 'TEAM' },
  { id: 'grow', label: '04', desc: 'GROW' },
  { id: 'mentors', label: '05', desc: 'JOIN US' },
];

export function ScrollRail({ activeSection }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed left-6 xl:left-12 top-0 bottom-0 z-50 hidden md:flex flex-col items-center pointer-events-none">
      {/* Continuous Line */}
      <div className="absolute top-0 bottom-0 w-[1px] bg-neutral-800" />

      {/* Nodes Container */}
      <div className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-16 items-center pointer-events-auto">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="group relative flex items-center justify-center w-8 h-8"
            >
              {/* Node Indicator */}
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-full transition-all duration-300 z-10",
                  isActive 
                    ? "w-2 h-2 bg-primary shadow-[0_0_10px_2px_rgba(184,134,11,0.5)]" 
                    : "w-3 h-3 bg-background border border-neutral-600 group-hover:border-neutral-400"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-ring"
                    className="absolute w-5 h-5 rounded-full border border-primary opacity-50"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>

              {/* Label */}
              <div className="absolute left-8 flex flex-col items-start opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={cn("text-[10px] leading-tight font-bold tracking-widest", isActive ? "text-primary" : "text-neutral-400")}>{section.label}</span>
                <span className="text-[9px] leading-tight font-medium tracking-widest text-neutral-500 uppercase">{section.desc}</span>
              </div>
              
              {/* Always visible label for active */}
              {isActive && (
                <div className="absolute left-8 flex flex-col items-start opacity-100">
                  <span className="text-[10px] leading-tight font-bold tracking-widest text-primary">{section.label}</span>
                  <span className="text-[9px] leading-tight font-medium tracking-widest text-neutral-500 uppercase">{section.desc}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Scroll Hint (Bottom) */}
      <div className={cn(
        "absolute bottom-8 flex flex-col items-center gap-3 text-neutral-500 transition-opacity duration-500",
        activeSection === 'home' ? 'opacity-100' : 'opacity-0'
      )}>
        <div className="w-[18px] h-[28px] border border-neutral-600 rounded-full flex justify-center p-1">
          <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce" />
        </div>
        <span className="text-[9px] uppercase tracking-widest whitespace-nowrap">Scroll to explore</span>
      </div>
    </div>
  );
}
