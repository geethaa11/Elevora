import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Logo } from '../layout/Logo';
import { Button } from '../ui/Button';
import { Play, ArrowRight } from 'lucide-react';
import { HeroBackground } from './HeroBackground';

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

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

        {/* Tagline is now inside Logo fullLockup */}

        <motion.p variants={item} className="mb-10 text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
          Discover opportunities. Validate ideas. Find teammates. <br className="hidden sm:block" />
          Get mentorship. Build winning projects.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-6">
          <Link to="/signup">
            <Button variant="primary" size="lg" className="px-8 font-semibold rounded-full bg-gradient-to-b from-[#D4AF37] to-[#996515] text-black border-none hover:opacity-90 shadow-[0_0_20px_rgba(184,134,11,0.3)]">
              Get Started <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={handleExplore} 
            className="px-6 rounded-full border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800/50 transition-colors gap-3"
          >
            Explore More
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-400">
              <Play size={10} className="ml-0.5 text-neutral-300" />
            </div>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
