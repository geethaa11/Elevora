import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Logo } from '../layout/Logo';
import { Button } from '../ui/Button';
import { Play, ArrowRight } from 'lucide-react';
import { HeroBackground } from './HeroBackground';

const roles = ["discover", "validate", "build", "grow"];

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const handleExplore = () => {
    document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="home" className="relative flex min-h-[110vh] flex-col items-center justify-center overflow-hidden bg-[#0D0D0F] pt-20 pb-32">
      {/* 3D Background Layer */}
      <HeroBackground />

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto"
      >
        <motion.div variants={item} className="mb-6">
          <Logo fullLockup />
        </motion.div>

        {/* Rotating Role Word */}
        <motion.div variants={item} className="mb-12 text-lg sm:text-xl text-neutral-300 max-w-xl leading-relaxed flex flex-wrap justify-center items-center gap-[0.35rem]">
          Your AI co-founder that helps you 
          <span className="relative inline-flex h-8 w-28 overflow-hidden align-middle items-center justify-center -translate-y-[2px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 font-display italic text-2xl text-[#B8860B] text-center flex items-center justify-center"
              >
                {roles[roleIndex]}.
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group rounded-full p-[2px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FDE08B] via-[#D4AF37] to-[#996515] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
            <Link to="/login" className="relative block">
              <Button variant="primary" size="lg" className="px-8 font-semibold rounded-full bg-gradient-to-b from-[#D4AF37] to-[#996515] text-black border-none shadow-[0_0_20px_rgba(184,134,11,0.3)] hover:opacity-100">
                Get Started <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="relative group rounded-full p-[1px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-transparent to-[#996515] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
            <Button 
              variant="ghost" 
              size="lg" 
              onClick={handleExplore} 
              className="relative px-6 rounded-full border border-neutral-700 group-hover:border-transparent bg-[#0D0D0F]/50 backdrop-blur-md transition-colors gap-3 h-full w-full"
            >
              Explore More
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-400 group-hover:border-[#D4AF37] transition-colors">
                <Play size={10} className="ml-0.5 text-neutral-300 group-hover:text-[#D4AF37] transition-colors" />
              </div>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
