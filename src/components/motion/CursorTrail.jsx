import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export function CursorTrail() {
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    
    let points = [];
    let sparks = [];
    let animationFrameId;
    let isHidden = false;
    let lastMousePos = { x: 0, y: 0 };

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
      lastMousePos = { x: e.clientX, y: e.clientY };
      points.push({ x: e.clientX, y: e.clientY, age: 0 });
      
      // Spawn some sparks based on movement speed or randomly
      if (Math.random() > 0.3) {
        for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
          sparks.push({
            x: e.clientX + (Math.random() - 0.5) * 20,
            y: e.clientY + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.5, // Drift slightly up
            age: 0,
            life: Math.random() * 0.5 + 0.3 // Spark lifetime
          });
        }
      }

      if (points.length > 50) {
        points.shift();
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Helper to interpolate between two hex colors based on t (0 to 1)
    const lerpColor = (c1, c2, t) => {
      const hex2rgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ] : [0, 0, 0];
      };
      
      const rgb1 = hex2rgb(c1);
      const rgb2 = hex2rgb(c2);
      
      const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
      const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
      const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
      
      return `rgb(${r}, ${g}, ${b})`;
    };

    const render = () => {
      if (!isHidden) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'screen';
        
        // Render smoky trail points
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          p.age += 0.02; 
          
          if (p.age > 1) {
            points.splice(i, 1);
            i--;
            continue;
          }
          
          const opacity = Math.max(0, 1 - p.age) * 0.4;
          const radius = 30 * (1 + p.age * 1.5); // expand to simulate smoke dispersing
          
          // Color sweep: Bright Gold -> Deep Gold -> Purple
          let colorBase;
          if (p.age < 0.5) {
            colorBase = lerpColor('#F5C874', '#B8860B', p.age * 2);
          } else {
            colorBase = lerpColor('#B8860B', '#6D28D9', (p.age - 0.5) * 2);
          }
          
          // Modify color string to inject alpha
          const colorWithAlpha = colorBase.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
          
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
          grad.addColorStop(0, colorWithAlpha);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
        
        // Render sparks
        for (let i = 0; i < sparks.length; i++) {
          const s = sparks[i];
          s.age += 0.02;
          s.x += s.vx;
          s.y += s.vy;
          
          if (s.age > s.life) {
            sparks.splice(i, 1);
            i--;
            continue;
          }
          
          // Sparks are bright gold or white, flashing at birth
          const sparkOpacity = Math.max(0, 1 - (s.age / s.life));
          ctx.fillStyle = `rgba(253, 224, 139, ${sparkOpacity * 0.8})`;
          
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.5 * sparkOpacity, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.globalCompositeOperation = 'source-over';
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
