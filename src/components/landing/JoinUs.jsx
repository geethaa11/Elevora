import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function JoinUs() {
  return (
    <section className="relative py-32 overflow-hidden bg-background border-t border-neutral-900">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(184,134,11,0.15)_0%,rgba(109,40,217,0.05)_40%,transparent_70%)] blur-3xl mix-blend-screen" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 mask-image-[radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-block text-primary font-bold tracking-widest text-[10px] mb-4 uppercase">
              The Journey Begins Here
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="font-display text-4xl sm:text-5xl md:text-6xl text-neutral-50 mb-6 leading-[1.1]"
          >
            Ready to build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">extraordinary?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-neutral-400 text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Join thousands of developers, designers, and innovators. Your next big breakthrough is just one hackathon away.
          </motion.p>
          
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.8 }}
             transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
             className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-semibold px-8 py-6 rounded-full group">
                Create Free Account
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/#discover">
               <Button variant="ghost" size="lg" className="w-full sm:w-auto text-neutral-300 hover:text-primary rounded-full px-8 py-6">
                 Learn More
               </Button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
