import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="relative py-24 overflow-hidden bg-background border-t border-neutral-900">
      
      {/* Background Graphic */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-center">
         {/* Top glowing edge */}
         <div className="absolute top-0 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
         
         <div className="absolute -bottom-[20%] w-[80%] max-w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(184,134,11,0.2)_0%,transparent_70%)] blur-2xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto rounded-3xl border border-neutral-800 bg-surface/30 backdrop-blur-md overflow-hidden p-8 sm:p-12 lg:p-16 text-center"
        >
          {/* Inner card glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(184,134,11,0.2)]">
                <Sparkles className="text-primary" size={28} />
             </div>

             <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-neutral-50 mb-6 leading-tight max-w-2xl">
               Don't just participate.<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ffecb3]">Dominate</span> every hackathon.
             </h2>

             <p className="text-neutral-400 text-sm sm:text-base max-w-lg mb-10">
               Elevora provides the insights, tools, and network you need to turn your ideas into winning projects.
             </p>

             <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-primary text-black hover:bg-primary/90 font-semibold rounded-full px-8 py-6 group flex items-center justify-center shadow-[0_0_20px_rgba(184,134,11,0.3)] hover:shadow-[0_0_30px_rgba(184,134,11,0.5)] transition-shadow">
                    Start Your Journey
                    <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </Link>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
