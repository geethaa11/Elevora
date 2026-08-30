import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles, Rocket } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="relative py-28 bg-[#09090B] border-t border-neutral-900 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[350px] bg-gradient-to-r from-primary/15 via-purple-600/10 to-blue-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-neutral-800 bg-[#121216]/90 backdrop-blur-xl p-8 sm:p-14 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Subtle gold grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            
            {/* Icon badge */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#996515] to-[#D4AF37] p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.4)] mb-6">
              <div className="w-full h-full rounded-2xl bg-[#0D0D0F] flex items-center justify-center text-primary">
                <Rocket size={26} />
              </div>
            </div>

            {/* Headline */}
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-neutral-50 tracking-tight leading-tight mb-4">
              Ready to build your next big idea?
            </h2>

            {/* Supporting text */}
            <p className="text-primary font-bold text-lg sm:text-xl tracking-wide mb-8">
              Discover. Match. Build. Present.
            </p>

            {/* Get Started Button */}
            <Link to="/login">
              <Button 
                variant="primary" 
                size="lg" 
                className="px-10 py-4 font-bold text-base rounded-full bg-gradient-to-r from-[#D4AF37] to-[#996515] text-black border-none shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight size={18} />
              </Button>
            </Link>

            <p className="mt-4 text-xs text-neutral-400">
              Join thousands of student hackers building winning teams on Elevora.
            </p>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
