import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Cpu, Rocket } from 'lucide-react';

export function Build() {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } }
  };

  const textItem = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : 60, y: 0 },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const visualContainer = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -60 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } }
  };

  return (
    <section id="build" className="relative flex min-h-[100vh] items-center py-24 overflow-hidden border-t border-neutral-900 bg-background">
      
      {/* Background ambient depth */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         {/* Subtle ambient light from left */}
         <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(109,40,217,0.06)_0%,transparent_70%)] blur-2xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:pr-32 relative z-10 pointer-events-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid lg:grid-cols-12 gap-12 items-center flex-col-reverse lg:flex-row" // Visual on left, Text on right
        >
          
          {/* Visual: Glowing Cube/Tech Platform (Slides from left) */}
          <motion.div 
            variants={visualContainer}
            className="lg:col-span-7 relative h-[600px] w-full flex items-center justify-center z-10 order-2 lg:order-1"
          >
            {/* Ambient Gold/Purple glow behind visual */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(184,134,11,0.1)_0%,transparent_60%)] pointer-events-none blur-2xl -z-10" />
            
             {/* Glowing Pedestal Rings (Smaller for Build) */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[400px] h-[100px] pointer-events-none z-0">
              <div className="absolute inset-0 rounded-[100%] border border-primary/20 shadow-[0_0_20px_rgba(184,134,11,0.1),inset_0_0_20px_rgba(184,134,11,0.05)]" style={{ transform: 'perspective(500px) rotateX(75deg)' }} />
              <div className="absolute inset-4 rounded-[100%] border border-primary/40 blur-[1px]" style={{ transform: 'perspective(500px) rotateX(75deg)' }} />
              {/* Upward glow rays */}
              <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-1/2 h-[200px] bg-gradient-to-t from-primary/5 to-transparent blur-xl" />
            </div>

            {/* Isometric abstract tech elements */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 -mt-10">
               {/* Central "Core" */}
               <div className="relative w-[150px] h-[150px] border border-primary/40 bg-surface/30 backdrop-blur-md shadow-[0_0_40px_rgba(184,134,11,0.2)] flex items-center justify-center" style={{ transform: 'rotateX(55deg) rotateZ(45deg)' }}>
                  <div className="w-[100px] h-[100px] border border-primary/60 bg-primary/10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(184,134,11,0.5)]">
                     <Cpu size={32} className="text-primary transform -rotate-45 -rotate-x-[55deg] drop-shadow-[0_0_8px_rgba(184,134,11,0.8)]" />
                  </div>
               </div>
               {/* Orbiting element 1 */}
               <div className="absolute w-[250px] h-[250px] border border-neutral-700/50 rounded-full border-dashed animate-[spin_20s_linear_infinite]" style={{ transform: 'rotateX(70deg)' }}>
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-surface border border-primary/50 rounded-sm flex items-center justify-center" style={{ transform: 'rotateX(-70deg)' }}>
                    <Code2 size={12} className="text-primary" />
                 </div>
               </div>
               {/* Orbiting element 2 */}
                <div className="absolute w-[350px] h-[350px] border border-neutral-800 rounded-full animate-[spin_30s_linear_infinite_reverse]" style={{ transform: 'rotateX(70deg)' }}>
                 <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-surface border border-purple-500/50 rounded-full flex items-center justify-center" style={{ transform: 'rotateX(-70deg)' }}>
                    <Rocket size={14} className="text-purple-400" />
                 </div>
               </div>
            </div>

            {/* Floating UI Elements */}
            <div className="relative w-full max-w-[500px] h-full z-30 pointer-events-none">
              <Card className="absolute top-[25%] left-[5%] w-[280px] p-4 shadow-2xl bg-[#111113]/95 backdrop-blur-md border border-neutral-800 rounded-xl transform -rotate-2">
                <div className="flex flex-col gap-2">
                  <div className="h-2 w-1/3 bg-neutral-800 rounded-full"></div>
                  <div className="h-2 w-full bg-neutral-800 rounded-full"></div>
                  <div className="h-2 w-2/3 bg-neutral-800 rounded-full"></div>
                  <div className="mt-2 h-16 w-full rounded border border-primary/20 bg-primary/5 flex items-center justify-center">
                    <span className="text-[10px] text-primary/50 font-mono">Generating Architecture...</span>
                  </div>
                </div>
              </Card>

               <Card className="absolute top-[65%] right-[10%] w-[220px] p-3 shadow-2xl bg-[#111113]/95 backdrop-blur-md border border-neutral-800 rounded-xl transform rotate-3">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-green-500/50 bg-green-500/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="font-bold text-xs text-neutral-50">API Deployed</h4>
                        <p className="text-[9px] text-neutral-400">Latency: 42ms</p>
                    </div>
                 </div>
              </Card>
            </div>
          </motion.div>

          {/* Text Content (Slides from right) */}
          <div className="lg:col-span-5 flex flex-col items-start z-10 order-1 lg:order-2">
            <motion.span variants={textItem} className="text-primary font-bold tracking-widest text-[10px] mb-4 uppercase">
              Build the Future
            </motion.span>
            <motion.h2 variants={textItem} className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-neutral-50 mb-6 leading-[1.1]">
              Ideate, Code, and Ship Faster
            </motion.h2>
            <motion.p variants={textItem} className="text-neutral-400 text-sm sm:text-base mb-8 max-w-md leading-relaxed">
              Use intelligent tools to accelerate your development process. Turn ideas into working prototypes in hours, not weeks.
            </motion.p>
            <motion.div variants={textItem}>
              <Link to="/signup">
                <Button variant="ghost" className="group rounded-full border border-neutral-700 hover:border-primary text-neutral-300 hover:text-primary transition-all">
                  Start Building
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
