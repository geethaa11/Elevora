import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Build() {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants
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
    <section id="build" className="relative flex min-h-[120vh] items-center py-24 overflow-hidden pointer-events-none">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:pl-32 relative z-10 pointer-events-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid lg:grid-cols-12 gap-12 items-center"
        >
          
          {/* Text Content (Slides from right) */}
          <div className="lg:col-span-5 flex flex-col items-start z-10">
            <motion.span variants={textItem} className="text-neutral-400 font-bold tracking-widest text-[10px] mb-4 uppercase">
              Validate. Improve. Innovate.
            </motion.span>
            <motion.h2 variants={textItem} className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-neutral-50 mb-6 leading-[1.1]">
              Turn your ideas into impactful solutions
            </motion.h2>
            <motion.p variants={textItem} className="text-neutral-400 text-sm sm:text-base mb-8 max-w-md leading-relaxed">
              Get AI-powered insights on your ideas, competitor analysis, feasibility and recommended tech stack.
            </motion.p>
            <motion.div variants={textItem}>
              <Link to="/signup">
                <Button variant="ghost" className="group rounded-full border border-neutral-700 hover:border-primary text-neutral-300 hover:text-primary transition-all">
                  Try AI Validator
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Visual: AI Validator Panel (Slides from left) */}
          <motion.div 
            variants={visualContainer}
            className="lg:col-span-7 relative h-[600px] w-full flex items-center justify-center z-10"
          >
            {/* AI Validator Panel */}
            <Card className="w-full max-w-[550px] p-0 bg-[#0a0a0c]/60 backdrop-blur-xl border border-neutral-800 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-neutral-800 bg-[#111114]/80">
                <Sparkles size={16} className="text-primary" />
                <span className="text-xs font-semibold text-neutral-300">AI Validator</span>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-4">
                 {/* Innovation Score */}
                 <div className="col-span-1 p-4 rounded-lg bg-[#141417]/80 border border-neutral-800/50 flex flex-col justify-between">
                   <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Innovation Score</span>
                     <TrendingUp size={12} className="text-neutral-600" />
                   </div>
                   <div>
                     <div className="flex items-baseline gap-1">
                       <span className="text-5xl font-display font-medium text-primary">84</span>
                       <span className="text-xs text-neutral-500">/100</span>
                     </div>
                     <span className="text-[10px] text-semantic-success mt-1 block">Excellent Potential</span>
                   </div>
                 </div>

                 {/* Feasibility */}
                 <div className="col-span-1 p-4 rounded-lg bg-[#141417]/80 border border-neutral-800/50 flex flex-col justify-between">
                   <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Feasibility</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-semantic-success shadow-[0_0_5px_#22C55E]" />
                   </div>
                   <div>
                     <span className="text-4xl font-display font-medium text-semantic-success">High</span>
                     <span className="text-[10px] text-neutral-400 mt-1 block">Great feasibility</span>
                   </div>
                 </div>

                 {/* Tech Stack */}
                 <div className="col-span-2 p-4 rounded-lg bg-[#141417]/80 border border-neutral-800/50">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-3">Tech Stack</span>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full border border-neutral-700 bg-surface flex items-center justify-center text-blue-400">⚛️</div>
                       <div className="w-10 h-10 rounded-full border border-neutral-700 bg-surface flex items-center justify-center text-green-500">🟢</div>
                       <div className="w-10 h-10 rounded-full border border-neutral-700 bg-surface flex items-center justify-center text-yellow-500">🐍</div>
                       <div className="w-8 h-8 rounded-full border border-neutral-700 bg-surface flex items-center justify-center text-[10px] text-neutral-400">+2</div>
                    </div>
                 </div>

                 {/* Suggested Features */}
                 <div className="col-span-2 p-4 rounded-lg bg-[#141417]/80 border border-neutral-800/50">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-3">Suggested Features</span>
                    <div className="flex flex-wrap gap-2">
                       <span className="text-[10px] px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">User Auth</span>
                       <span className="text-[10px] px-2 py-1 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">AI Chatbot</span>
                       <span className="text-[10px] px-2 py-1 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">Analytics</span>
                       <span className="text-[10px] px-2 py-1 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">Real-time Sync</span>
                    </div>
                 </div>
              </div>
            </Card>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
