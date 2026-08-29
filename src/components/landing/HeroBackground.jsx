import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function HeroBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0D0D0F]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-full"
      >
        {!shouldReduceMotion ? (
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_051048_5ef213b5-26db-4da8-b604-7ef823760b6b.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-70 mix-blend-screen"
          />
        ) : (
          <div className="w-full h-full bg-[#111111]" />
        )}
        
        {/* Subtle gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-transparent to-transparent opacity-80" />
      </motion.div>
    </div>
  );
}
