import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Heart, Code, Palette, Zap } from 'lucide-react';

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
         <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(109,40,217,0.06)_0%,transparent_70%)] blur-2xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:pr-32 relative z-10 pointer-events-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid lg:grid-cols-12 gap-12 items-center flex-col-reverse lg:flex-row"
        >
          
          {/* Visual: Stacked Swipe Cards (Slides from left) */}
          <motion.div 
            variants={visualContainer}
            className="lg:col-span-7 relative h-[600px] w-full flex items-center justify-center z-10 order-2 lg:order-1"
          >
            {/* Ambient Gold glow behind visual */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(184,134,11,0.1)_0%,transparent_60%)] pointer-events-none blur-2xl -z-10" />
            
            <div className="relative w-full max-w-[320px] h-[440px] z-30 pointer-events-none">
              
              {/* Back Card */}
              <Card className="absolute inset-0 shadow-2xl bg-[#111113]/80 backdrop-blur-md border border-neutral-800 rounded-2xl transform rotate-6 scale-90 translate-x-6 translate-y-4 opacity-40">
              </Card>

              {/* Middle Card */}
              <Card className="absolute inset-0 shadow-2xl bg-[#111113]/90 backdrop-blur-md border border-neutral-800 rounded-2xl transform rotate-3 scale-95 translate-x-3 translate-y-2 opacity-70">
              </Card>

              {/* Front Card (Active) */}
              <Card className="absolute inset-0 shadow-2xl bg-[#151518] border border-neutral-700 rounded-2xl flex flex-col p-6 z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-purple-600 mb-4 p-[2px]">
                  <div className="w-full h-full bg-surface rounded-full flex items-center justify-center">
                    <Code size={24} className="text-primary" />
                  </div>
                </div>
                
                <h3 className="font-display text-2xl font-bold text-neutral-50">Alex Chen</h3>
                <p className="text-sm font-medium text-primary mb-4">Full Stack Developer</p>
                
                <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                  "Looking for a UI designer and an ML engineer to build an AI-powered health tracking app for the next hackathon."
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase bg-neutral-800 text-neutral-300 rounded border border-neutral-700">React</span>
                  <span className="px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase bg-neutral-800 text-neutral-300 rounded border border-neutral-700">Node.js</span>
                  <span className="px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase bg-neutral-800 text-neutral-300 rounded border border-neutral-700">Python</span>
                </div>

                <div className="mt-auto flex justify-between items-center px-4">
                  <div className="w-12 h-12 rounded-full border border-semantic-danger/30 bg-semantic-danger/10 flex items-center justify-center text-semantic-danger shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                    <X size={20} strokeWidth={2.5} />
                  </div>
                  <div className="w-12 h-12 rounded-full border border-semantic-success/30 bg-semantic-success/10 flex items-center justify-center text-semantic-success shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                    <Heart size={20} strokeWidth={2.5} />
                  </div>
                </div>
              </Card>

            </div>
          </motion.div>

          {/* Text Content (Slides from right) */}
          <div className="lg:col-span-5 flex flex-col items-start z-10 order-1 lg:order-2">
            <motion.span variants={textItem} className="text-primary font-bold tracking-widest text-[10px] mb-4 uppercase">
              Find Your Team
            </motion.span>
            
            <motion.div variants={textItem} className="mb-2">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide">
                Tinder for Hackmates
              </span>
            </motion.div>
            
            <motion.h2 variants={textItem} className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-neutral-50 mb-6 leading-[1.1]">
              Swipe Your Way to the <span className="text-primary">Right Team</span>
            </motion.h2>
            
            <motion.p variants={textItem} className="text-neutral-400 text-sm sm:text-base mb-8 max-w-md leading-relaxed">
              Swipe through teammate profiles filtered by skills, interests, and hackathon goals. Match with people who complement your skillset to form a team fast — no cold DMs, no random Discord searching.
            </motion.p>
            
            <motion.div variants={textItem}>
              <Link to="/team-builder">
                <Button variant="ghost" className="group rounded-full border border-neutral-700 hover:border-primary text-neutral-300 hover:text-primary transition-all">
                  Find Teammates
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
