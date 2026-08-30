import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

export function ScrollStarLine() {
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  
  // Cache the path length so we don't recalculate it every scroll tick
  const pathLengthRef = useRef(0);

  useEffect(() => {
    if (shouldReduceMotion) return;

    if (pathRef.current) {
      pathLengthRef.current = pathRef.current.getTotalLength();
    }

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
        
        const length = pathLengthRef.current;
        const point = pathRef.current.getPointAtLength(progress * length);
        
        dotRef.current.style.left = `${point.x}%`;
        dotRef.current.style.top = `${point.y / 10}%`;
        
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const handleResize = () => {
      // Recalculate on resize in case vector shape changed
      if (pathRef.current) {
        pathLengthRef.current = pathRef.current.getTotalLength();
      }
      handleScroll();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial call
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <div className="absolute right-0 top-0 w-24 md:w-48 h-full pointer-events-none z-[48] hidden lg:block overflow-visible">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
        <path 
          ref={pathRef}
          d="M 20,0 
             C 90,80 90,120 40,200 
             C -10,280 -10,320 40,400 
             C 90,480 90,520 40,600 
             C -10,680 -10,720 40,800 
             C 90,880 90,920 40,1000"
          fill="none" 
          stroke="#B8860B" 
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeOpacity="0.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div 
        ref={dotRef}
        className="absolute w-1.5 h-1.5 bg-white rounded-full"
        style={{
          left: '20%',
          top: '0%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px 3px rgba(184, 134, 11, 0.8), 0 0 4px 1px rgba(255, 255, 255, 0.9)'
        }}
      />
    </div>
  );
}
