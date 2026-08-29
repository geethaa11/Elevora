import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function FinalCta() {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } }
  };

  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <section className="relative flex min-h-[120vh] flex-col justify-end overflow-hidden pb-24 pt-32 pointer-events-none final-cta">
      {/* Foreground Cliff & Astronaut Silhouette (Overlaying 3D Scene) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#000] rounded-[100%] shadow-[0_-5px_20px_rgba(184,134,11,0.3)] blur-[2px]" />
        
        {/* Astronaut Figure */}
        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 w-[30px] h-[75px] flex flex-col items-center">
          {/* Head */}
          <div className="w-6 h-7 bg-[#000] rounded-[10px_10px_5px_5px] shadow-[inset_0_2px_5px_rgba(184,134,11,0.5)] z-10" />
          {/* Torso */}
          <div className="w-8 h-12 bg-[#000] -mt-1 rounded-[5px_5px_8px_8px] shadow-[inset_0_0_8px_rgba(184,134,11,0.4)] z-0" />
          {/* Legs */}
          <div className="flex gap-1 -mt-2">
            <div className="w-3 h-10 bg-[#000] rounded-full shadow-[inset_-2px_0_4px_rgba(184,134,11,0.3)]" />
            <div className="w-3 h-10 bg-[#000] rounded-full shadow-[inset_2px_0_4px_rgba(184,134,11,0.3)]" />
          </div>
          {/* Arms */}
          <div className="absolute top-[30px] left-[-4px] w-3 h-10 bg-[#000] rounded-full rotate-6 shadow-[inset_2px_0_4px_rgba(184,134,11,0.3)]" />
          <div className="absolute top-[30px] right-[-4px] w-3 h-10 bg-[#000] rounded-full -rotate-6 shadow-[inset_-2px_0_4px_rgba(184,134,11,0.3)]" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:pl-32 relative z-10 pointer-events-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-start text-left max-w-xl"
        >
          <motion.span variants={item} className="text-neutral-400 font-bold tracking-widest text-[10px] mb-4 uppercase">
            Ready to build the future?
          </motion.span>
          
          <motion.h2 variants={item} className="font-display text-4xl sm:text-5xl md:text-6xl text-neutral-50 mb-10 leading-[1.1]">
            Your journey starts now.<br />Let's elevate together.
          </motion.h2>

          <motion.div variants={item}>
            <Link to="/signup">
              <Button variant="primary" size="lg" className="px-8 font-semibold rounded-full bg-gradient-to-b from-[#D4AF37] to-[#996515] text-black border-none hover:opacity-90 shadow-[0_0_20px_rgba(184,134,11,0.3)]">
                Join Elevora <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Footer minimal */}
      <div className="absolute bottom-6 left-6 xl:left-32 text-[10px] text-neutral-600 z-10 uppercase tracking-widest pointer-events-auto">
        © {new Date().getFullYear()} Elevora. All rights reserved.
      </div>
    </section>
  );
}
