import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Logo } from '../layout/Logo';
import { Button } from '../ui/Button';
import { Play, ArrowRight } from 'lucide-react';

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
    <section id="home" className="relative flex min-h-[110vh] flex-col items-center justify-center overflow-hidden bg-[#050505] pt-20 pb-32">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/background.jpg')" }}
        />
        {/* Gradient overlay to fade into the black background at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />

        {/* Large sweeping glowing dust bands */}
        <div className="absolute top-1/4 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(184,134,11,0.15)_0%,transparent_60%)] transform -rotate-12 blur-2xl" />
        <div className="absolute top-1/3 right-0 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(184,134,11,0.1)_0%,transparent_60%)] transform rotate-12 blur-2xl" />

        {/* Floating Asteroids (simulated with dots) */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 overflow-hidden">
             {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-[#3a2d10] shadow-[0_0_10px_1px_rgba(184,134,11,0.3)]"
                  style={{
                    width: Math.random() * 6 + 2 + 'px',
                    height: Math.random() * 6 + 2 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                  }}
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
             ))}
          </div>
        )}

        {/* Massive Horizon Planet at bottom */}
        <div className="absolute bottom-[-30%] left-1/2 w-[200%] max-w-[3000px] -translate-x-1/2 aspect-[2/1]">
           <div className="absolute inset-0 rounded-[100%] bg-background border-t border-primary/30 shadow-[0_-20px_100px_30px_rgba(184,134,11,0.15)]" />
           <div className="absolute inset-0 rounded-[100%] border-t-2 border-primary opacity-60 blur-[2px]" />
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-40 bg-primary/20 blur-[60px]" />
        </div>
      </div>

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
