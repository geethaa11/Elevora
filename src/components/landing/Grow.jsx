import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Users, TrendingUp } from 'lucide-react';

export function Grow() {
  const shouldReduceMotion = useReducedMotion();

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
    <section id="grow" className="relative flex min-h-[100vh] items-center py-24 overflow-hidden border-t border-neutral-900 bg-background">
      
      {/* Background ambient depth */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         {/* Subtle ambient light from right */}
         <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(184,134,11,0.06)_0%,transparent_70%)] blur-2xl" />
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
              Grow Your Network & Skills
            </motion.span>
            <motion.h2 variants={textItem} className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-neutral-50 mb-6 leading-[1.1]">
              Elevate your tech career
            </motion.h2>
            <motion.p variants={textItem} className="text-neutral-400 text-sm sm:text-base mb-8 max-w-md leading-relaxed">
              Connect with like-minded builders, win prizes, and build a portfolio that stands out to top tech companies.
            </motion.p>
            <motion.div variants={textItem}>
              <Link to="/signup">
                <Button variant="ghost" className="group rounded-full border border-neutral-700 hover:border-primary text-neutral-300 hover:text-primary transition-all">
                  Join the Community
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Visual: Glowing Graph/Network (Slides from right) */}
          <motion.div 
            variants={visualContainer}
            className="lg:col-span-7 relative h-[600px] w-full flex items-center justify-center z-10"
          >
             {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[radial-gradient(ellipse_at_center,rgba(109,40,217,0.1)_0%,transparent_60%)] pointer-events-none blur-3xl -z-10" />

            {/* Glowing Pedestal Rings */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[120px] pointer-events-none z-0">
              <div className="absolute inset-0 rounded-[100%] border border-primary/20 shadow-[0_0_25px_rgba(184,134,11,0.1),inset_0_0_25px_rgba(184,134,11,0.05)]" style={{ transform: 'perspective(500px) rotateX(75deg)' }} />
              <div className="absolute inset-4 rounded-[100%] border border-purple-500/20 blur-[1px]" style={{ transform: 'perspective(500px) rotateX(75deg)' }} />
              {/* Upward glow rays */}
              <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-3/4 h-[250px] bg-gradient-to-t from-purple-500/5 to-transparent blur-xl" />
            </div>

            {/* Abstract Graphic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 -mt-8">
               {/* Ascending platforms */}
               <div className="relative w-full h-full max-w-[400px] max-h-[400px]">
                  <div className="absolute bottom-[20%] left-[20%] w-[100px] h-[100px] border border-neutral-700 bg-surface/40 flex items-center justify-center" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}>
                      <Users size={24} className="text-neutral-500 transform -rotate-45 -rotate-x-[60deg]" />
                  </div>
                  <div className="absolute bottom-[40%] left-[45%] w-[120px] h-[120px] border border-primary/40 bg-primary/10 flex items-center justify-center shadow-[0_0_30px_rgba(184,134,11,0.2)]" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}>
                      <TrendingUp size={32} className="text-primary transform -rotate-45 -rotate-x-[60deg] drop-shadow-[0_0_5px_rgba(184,134,11,0.8)]" />
                  </div>
                  <div className="absolute bottom-[65%] left-[70%] w-[140px] h-[140px] border border-purple-500/40 bg-purple-500/10 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.2)]" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}>
                      <Trophy size={40} className="text-purple-400 transform -rotate-45 -rotate-x-[60deg] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  </div>

                  {/* Connecting lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                      <path d="M 120 280 L 220 200 L 320 120" stroke="rgba(184,134,11,0.3)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                  </svg>
               </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="relative w-full max-w-[500px] h-full z-30 pointer-events-none">
               <Card className="absolute top-[20%] left-[5%] w-[200px] p-4 shadow-2xl bg-[#111113]/95 backdrop-blur-md border border-neutral-800 rounded-xl transform rotate-2">
                 <p className="text-[10px] text-neutral-400 mb-1">Global Ranking</p>
                 <h4 className="font-display text-2xl text-neutral-50">Top 5%</h4>
                 <div className="w-full bg-neutral-800 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-primary" />
                 </div>
               </Card>

               <Card className="absolute top-[70%] right-[5%] w-[240px] p-4 shadow-2xl bg-[#111113]/95 backdrop-blur-md border border-neutral-800 rounded-xl transform -rotate-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center">
                        <Trophy size={16} className="text-purple-400" />
                    </div>
                    <div>
                        <p className="text-[10px] text-neutral-400">Recent Achievement</p>
                        <h4 className="font-bold text-sm text-neutral-50">Hackathon Winner</h4>
                    </div>
                 </div>
               </Card>
            </div>

          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
