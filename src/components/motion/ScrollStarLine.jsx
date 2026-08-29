import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

export function ScrollStarLine() {
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    let rafId;
    const handleScroll = () => {
      // Use requestAnimationFrame to throttle scroll updates
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        if (!pathRef.current || !dotRef.current) {
          rafId = null;
          return;
        }
        
        const scrollY = window.scrollY;
        // Calculate max scrollable height
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        // Progress between 0 and 1
        const progress = Math.max(0, Math.min(1, docHeight > 0 ? scrollY / docHeight : 0));
        
        const length = pathRef.current.getTotalLength();
        const point = pathRef.current.getPointAtLength(progress * length);
        
        dotRef.current.setAttribute('cx', point.x);
        dotRef.current.setAttribute('cy', point.y);
        
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial call
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <div className="absolute right-4 top-0 w-8 h-full pointer-events-none z-10 overflow-visible opacity-50 hidden md:block">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
        <defs>
          <filter id="gold-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path 
          ref={pathRef}
          d="M 50,0 Q 90,100 50,200 T 50,400 T 50,600 T 50,800 T 50,1000"
          fill="none" 
          stroke="#B8860B" 
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <circle 
          ref={dotRef}
          cx="50" 
          cy="0" 
          r="4" 
          fill="#FFF" 
          filter="url(#gold-glow)"
        />
      </svg>
    </div>
  );
}
