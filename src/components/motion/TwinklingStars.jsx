import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export function TwinklingStars() {
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    let animationFrameId;
    let isHidden = false;

    const initStars = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight * 3
      );
      
      stars = [];
      for(let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          // Distribute across the entire scroll height
          y: Math.random() * documentHeight,
          size: Math.random() * 1.2 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: (Math.random() * 0.015 + 0.005) * (shouldReduceMotion ? 0 : 1)
        });
      }
    };
    
    const onVisibilityChange = () => {
      isHidden = document.hidden;
    };

    window.addEventListener('resize', initStars);
    document.addEventListener('visibilitychange', onVisibilityChange);
    
    // Slight delay to ensure layout height is calculated
    setTimeout(initStars, 100);

    const render = () => {
      if (!isHidden) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scrollY = window.scrollY;
        
        ctx.fillStyle = '#B8860B';
        
        for(let i = 0; i < stars.length; i++) {
          const s = stars[i];
          const screenY = s.y - scrollY;
          
          // Only draw and update if on screen
          if (screenY > -10 && screenY < canvas.height + 10) {
             if (!shouldReduceMotion) {
               s.phase += s.speed;
             }
             const alpha = (Math.sin(s.phase) + 1) / 2 * 0.7 + 0.1; // 0.1 to 0.8
             ctx.globalAlpha = alpha;
             ctx.beginPath();
             ctx.arc(s.x, screenY, s.size, 0, Math.PI * 2);
             ctx.fill();
          }
        }
        ctx.globalAlpha = 1.0;
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', initStars);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[1]" 
    />
  );
}
