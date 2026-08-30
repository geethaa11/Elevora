import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight, Users, Sparkles, Trophy, Code, Compass, Zap, ShieldCheck } from 'lucide-react';
import { HeroBackground } from './HeroBackground';

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="home" className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-[#0D0D0F] pt-28 pb-20">
      {/* Background ambient lighting */}
      <HeroBackground />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#D4AF37]/15 via-purple-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl"
      >
        
        {/* Left Column: Headline & Action CTAs */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">
          
          {/* Badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wide mb-6 backdrop-blur-md">
            <Sparkles size={14} className="animate-pulse" />
            <span>AI-Powered Hackathon & Teaming Platform</span>
          </motion.div>

          {/* Core Headline */}
          <motion.h1 variants={item} className="font-display text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold text-neutral-50 tracking-tight leading-[1.08] mb-6">
            YOUR NEXT HACKATHON <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#FDE08B] via-[#D4AF37] to-[#996515] bg-clip-text text-transparent">
              STARTS HERE.
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p variants={item} className="text-neutral-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed mb-8 max-w-xl">
            Discover hackathons. Build the right team. Get the guidance you need to turn your idea into impact.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link to="/hackathons" className="w-full sm:w-auto">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full sm:w-auto px-8 py-3.5 font-bold rounded-full bg-gradient-to-r from-[#D4AF37] to-[#996515] text-black border-none shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Compass size={18} />
                Explore Hackathons
                <ArrowRight size={16} />
              </Button>
            </Link>

            <Link to="/team-builder" className="w-full sm:w-auto">
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full sm:w-auto px-7 py-3.5 font-semibold rounded-full border border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200 hover:text-white backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <Users size={18} className="text-primary" />
                Build My Team
              </Button>
            </Link>
          </motion.div>

          {/* Proof Badges */}
          <motion.div variants={item} className="mt-10 pt-6 border-t border-neutral-800/80 flex items-center gap-6 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-primary" />
              <span>Smart Compatibility Matching</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy size={16} className="text-primary" />
              <span>Global Hackathon Hub</span>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Hero Interactive Network & Matching Illustration */}
        <motion.div variants={item} className="flex-1 w-full max-w-lg lg:max-w-none relative flex justify-center">
          
          <div className="relative w-full max-w-md lg:max-w-lg h-[420px] sm:h-[460px] rounded-3xl border border-neutral-800/80 bg-[#111115]/90 backdrop-blur-xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(212,175,55,0.05)] overflow-hidden flex flex-col justify-between">
            
            {/* Background Mesh Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Header Badge */}
            <div className="relative z-10 flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-neutral-300">Live Hackathon Network</span>
              </div>
              <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                AI Match Active
              </span>
            </div>

            {/* Network Nodes Visualization */}
            <div className="relative z-10 my-auto h-[260px] flex items-center justify-center">
              
              {/* Central Source Node */}
              <div className="absolute z-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#996515] to-[#D4AF37] p-0.5 shadow-[0_0_25px_rgba(212,175,55,0.6)]">
                  <div className="w-full h-full rounded-full bg-[#0D0D0F] flex items-center justify-center text-primary font-bold text-lg">
                    YOU
                  </div>
                </div>
                <span className="mt-1 text-[11px] font-semibold text-neutral-200 bg-neutral-900/90 px-2 py-0.5 rounded-full border border-neutral-700">
                  Frontend Dev
                </span>
              </div>

              {/* Connecting Pulsing Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.4))' }}>
                <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
              </svg>

              {/* Connected Node 1: AI Developer */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 left-4 z-10 flex items-center gap-2 p-2.5 rounded-2xl bg-neutral-900/90 border border-emerald-500/40 shadow-lg backdrop-blur-md"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  <Code size={18} />
                </div>
                <div className="text-left pr-1">
                  <div className="text-xs font-bold text-neutral-100">Maya L.</div>
                  <div className="text-[10px] text-neutral-400">AI Engineer</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  92%
                </span>
              </motion.div>

              {/* Connected Node 2: UI/UX Designer */}
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-4 right-4 z-10 flex items-center gap-2 p-2.5 rounded-2xl bg-neutral-900/90 border border-primary/40 shadow-lg backdrop-blur-md"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                  <Sparkles size={18} />
                </div>
                <div className="text-left pr-1">
                  <div className="text-xs font-bold text-neutral-100">Samira P.</div>
                  <div className="text-[10px] text-neutral-400">UI/UX Lead</div>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/30">
                  88%
                </span>
              </motion.div>

              {/* Connected Node 3: Backend Engineer */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-2 z-10 flex items-center gap-2.5 p-2.5 rounded-2xl bg-neutral-900/90 border border-blue-500/40 shadow-lg backdrop-blur-md"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  <Zap size={18} />
                </div>
                <div className="text-left pr-2">
                  <div className="text-xs font-bold text-neutral-100">Devon V.</div>
                  <div className="text-[10px] text-neutral-400">Backend & Cloud</div>
                </div>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/30">
                  95%
                </span>
              </motion.div>

            </div>

            {/* Bottom Status Ribbon */}
            <div className="relative z-10 flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-neutral-800">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Users size={14} className="text-primary" />
                Complementary Skill Matrix
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">
                Team Ready to Build
              </span>
            </div>

          </div>

        </motion.div>

      </motion.div>
    </section>
  );
}
