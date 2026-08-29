import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const words = ["Discover", "Validate", "Build", "Grow"];

export function LoadingScreen() {
  const shouldReduceMotion = useReducedMotion();
  const [show, setShow] = useState(() => {
    return !sessionStorage.getItem('elevora_loaded');
  });
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const reqRef = useRef();

  useEffect(() => {
    if (!show) return;

    if (shouldReduceMotion) {
      setProgress(100);
      setTimeout(() => {
        sessionStorage.setItem('elevora_loaded', 'true');
        setShow(false);
      }, 500);
      return;
    }

    // Cycle words
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 900);

    // Counter animation 0->100 over ~2.2s
    const startTime = performance.now();
    const duration = 2200;

    const animate = (time) => {
      const elapsed = time - startTime;
      const nextProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(nextProgress);
      
      if (elapsed < duration) {
        reqRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          sessionStorage.setItem('elevora_loaded', 'true');
          setShow(false);
        }, 400);
      }
    };
    reqRef.current = requestAnimationFrame(animate);

    return () => {
      clearInterval(interval);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [show, shouldReduceMotion]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0D0D0F]"
        >
          <div className="absolute top-8 left-8 text-[10px] font-mono uppercase tracking-[0.3em] text-[#B8860B]">
            ELEVORA
          </div>

          <div className="relative h-20 w-80 overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="font-display italic text-4xl lg:text-6xl text-[#B8860B]"
              >
                {words[index]}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-8 right-8 font-mono text-4xl lg:text-6xl text-neutral-50 tabular-nums">
            {Math.floor(progress).toString().padStart(3, '0')}
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-neutral-900 origin-left">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] origin-left"
              style={{ scaleX: progress / 100 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
