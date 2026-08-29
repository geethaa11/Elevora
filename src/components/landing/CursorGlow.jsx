import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function CursorGlow() {
  const [shouldRender, setShouldRender] = useState(false);
  const cursorX = useSpring(0, { damping: 40, stiffness: 200, mass: 0.5 });
  const cursorY = useSpring(0, { damping: 40, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    // Detect touch device and reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || reducedMotion) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  if (!shouldRender) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        x: cursorX,
        y: cursorY,
        background: 'radial-gradient(circle, rgba(184, 134, 11, 0.15) 0%, rgba(109, 40, 217, 0.08) 40%, transparent 70%)',
      }}
    />
  );
}
