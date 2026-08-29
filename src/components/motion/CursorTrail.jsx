import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export function CursorTrail() {
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let points = [];
    let animationFrameId;
    let isHidden = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const onVisibilityChange = () => {
      isHidden = document.hidden;
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    resize();

    const onMouseMove = (e) => {
      if (isHidden) return;
      points.push({ x: e.clientX, y: e.clientY, age: 0 });
      // Keep a buffer limit
      if (points.length > 40) {
        points.shift();
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const render = () => {
      if (!isHidden) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          p.age += 0.025; // Fade over ~40 frames
          
          if (p.age > 1) {
            points.splice(i, 1);
            i--;
            continue;
          }
          
          const opacity = 1 - p.age;
          const radius = 30 * (1 + p.age * 0.5); // expand slightly
          
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
          grad.addColorStop(0, `rgba(184, 134, 11, ${opacity * 0.5})`);
          grad.addColorStop(1, 'rgba(184, 134, 11, 0)');
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[49]" 
    />
  );
}
