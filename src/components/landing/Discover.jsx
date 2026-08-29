import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Discover() {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } }
  };

  const textItem = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -60, y: 0 },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const visualContainer = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : 60 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } }
  };

  return (
    <section id="discover" className="relative flex min-h-[100vh] items-center py-24 overflow-hidden border-t border-neutral-900 bg-background">
      
      {/* Background ambient depth */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Starfield bleed from Hero */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen" style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:pl-32 relative z-10 pointer-events-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid lg:grid-cols-12 gap-12 items-center"
        >
          
          {/* Text Content (Slides from left) */}
          <div className="lg:col-span-5 flex flex-col items-start z-10">
            <motion.span variants={textItem} className="text-primary font-bold tracking-widest text-[10px] mb-4 uppercase">
              Discover Limitless Opportunities
            </motion.span>
            <motion.h2 variants={textItem} className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-neutral-50 mb-6 leading-[1.1]">
              Find the right hackathon for you
            </motion.h2>
            <motion.p variants={textItem} className="text-neutral-400 text-sm sm:text-base mb-8 max-w-md leading-relaxed">
              Explore global hackathons curated for your interests. Never miss an opportunity that matches your passion.
            </motion.p>
            <motion.div variants={textItem}>
              <Link to="/signup">
                <Button variant="ghost" className="group rounded-full border border-neutral-700 hover:border-primary text-neutral-300 hover:text-primary transition-all">
                  Explore Hackathons
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Visual: Globe/Network with floating cards & Pedestal (Slides from right) */}
          <motion.div 
            variants={visualContainer}
            className="lg:col-span-7 relative h-[600px] w-full flex items-center justify-center z-10"
          >
            {/* Ambient Gold/Purple glow behind visual */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(184,134,11,0.12)_0%,rgba(109,40,217,0.08)_40%,transparent_70%)] pointer-events-none blur-xl -z-10" />

            {/* Glowing Pedestal Rings */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[150px] pointer-events-none z-0">
              <div className="absolute inset-0 rounded-[100%] border border-primary/30 shadow-[0_0_30px_rgba(184,134,11,0.15),inset_0_0_30px_rgba(184,134,11,0.1)]" style={{ transform: 'perspective(500px) rotateX(75deg)' }} />
              <div className="absolute inset-4 rounded-[100%] border border-primary/50 blur-[1px]" style={{ transform: 'perspective(500px) rotateX(75deg)' }} />
              <div className="absolute inset-10 rounded-[100%] border-2 border-primary/80 blur-[2px]" style={{ transform: 'perspective(500px) rotateX(75deg)' }} />
              {/* Upward glow rays */}
              <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-1/2 h-[300px] bg-gradient-to-t from-primary/10 to-transparent blur-2xl" />
            </div>

            {/* Background Graphic (Globe) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 -mt-16">
               <div className="relative w-[350px] h-[350px] rounded-full border border-neutral-700/50 bg-surface/20 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_0_50px_rgba(184,134,11,0.1)] flex items-center justify-center overflow-hidden">
                 {/* Simulate globe grid */}
                 <div className="absolute w-[200%] h-[200%] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] rounded-full" style={{ transform: 'rotateX(60deg) rotateY(20deg) scale(0.6)' }} />
                 <Globe size={350} className="text-primary/20 absolute" strokeWidth={0.5} />
               </div>
            </div>

            {/* Floating Cards */}
            <div className="relative w-full max-w-[500px] h-full z-30">
              <Card className="absolute top-[30%] right-[-5%] w-[320px] p-4 shadow-2xl bg-[#111113]/95 backdrop-blur-md border border-neutral-800 rounded-xl transform rotate-2 hover:rotate-0 transition-all duration-500 hover:border-primary/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-[#5a4205] flex items-center justify-center">
                    <span className="text-black font-bold">SIH</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-50 leading-tight">Smart India Hackathon 2024</h4>
                    <p className="text-[10px] text-neutral-400">AI/ML, Healthcare</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center border-t border-neutral-800 pt-3">
                  <span className="text-xs text-neutral-400">Prize Pool</span>
                  <span className="text-sm font-semibold text-primary">₹1,00,00,000+</span>
                </div>
              </Card>

              <Card className="absolute top-[60%] left-[5%] w-[260px] p-4 shadow-2xl bg-[#111113]/95 backdrop-blur-md border border-neutral-800 rounded-xl transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:border-primary/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-neutral-50 leading-tight">Devfolio Hackathon</h4>
                  <Badge variant="featured" className="text-[9px] px-1.5 py-0">Web3</Badge>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-[10px] text-neutral-400">Prize Pool</span>
                  <span className="text-xs font-semibold text-primary">$10,000</span>
                </div>
              </Card>
              
              <Card className="absolute top-[15%] left-[10%] w-[240px] p-3 shadow-2xl bg-[#111113]/95 backdrop-blur-md border border-neutral-800 rounded-xl transform rotate-1 hover:rotate-0 transition-all duration-500 hover:border-primary/50">
                 <h4 className="font-bold text-xs text-neutral-50 mb-1">MLH Fellowship</h4>
                 <p className="text-[10px] text-neutral-400 mb-2">Open to all</p>
                 <div className="flex gap-1">
                   <Badge className="bg-neutral-800 text-[8px] px-1">Open Source</Badge>
                 </div>
              </Card>
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
