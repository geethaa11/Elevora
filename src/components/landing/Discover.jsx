import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HackathonTemplateCarousel } from '../domain/HackathonTemplateCarousel';

export function Discover() {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } }
  };

  const textItem = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="discover" className="relative flex min-h-[100vh] flex-col items-center justify-center py-24 overflow-hidden border-t border-neutral-900 bg-background">
      {/* Background ambient depth */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(184,134,11,0.12)_0%,rgba(109,40,217,0.08)_40%,transparent_70%)] blur-2xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col items-center gap-10"
        >
          {/* Header text */}
          <div className="flex flex-col items-center text-center max-w-2xl">
            <motion.span variants={textItem} className="text-primary font-bold tracking-widest text-[10px] mb-3 uppercase">
              Discover Limitless Templates
            </motion.span>
            <motion.h2 variants={textItem} className="font-display text-3xl sm:text-5xl font-bold text-neutral-50 mb-4 leading-tight">
              Find the right hackathon template for you
            </motion.h2>
            <motion.p variants={textItem} className="text-neutral-400 text-sm sm:text-base mb-6 leading-relaxed">
              Browse pre-built hackathon scaffolding for AI/ML, Web3, GovTech, HealthTech, and Sustainability projects.
            </motion.p>
          </div>

          {/* Interactive 3-Card Auto-Play Templates Carousel */}
          <motion.div variants={textItem} className="w-full">
            <HackathonTemplateCarousel title="Interactive Hackathon Templates" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

