import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const TEAMMATES = [
  { name: 'Arjun', role: 'AI/ML Engineer', rating: '4.9', pos: 'top-[10%] left-[5%]' },
  { name: 'Priya', role: 'UI/UX Designer', rating: '4.9', pos: 'top-[10%] right-[5%]' },
  { name: 'Karthik', role: 'Full Stack Dev', rating: '4.7', pos: 'bottom-[15%] left-[0%]' },
  { name: 'Sneha', role: 'Product Strategist', rating: '4.9', pos: 'bottom-[15%] right-[0%]' },
];

export function Grow() {
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
    <section id="grow" className="relative flex min-h-[120vh] items-center py-24 overflow-hidden pointer-events-none">
      
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
              Build Better Together
            </motion.span>
            <motion.h2 variants={textItem} className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-neutral-50 mb-6 leading-[1.1]">
              Find your dream team with AI
            </motion.h2>
            <motion.p variants={textItem} className="text-neutral-400 text-sm sm:text-base mb-8 max-w-md leading-relaxed">
              We match you with the most compatible teammates based on skills, interests and goals.
            </motion.p>
            <motion.div variants={textItem}>
              <Link to="/signup">
                <Button variant="ghost" className="group rounded-full border border-neutral-700 hover:border-primary text-neutral-300 hover:text-primary transition-all">
                  Find Teammates
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Visual: Profile Cards (Slides from right, Hexagon is in 3D Canvas) */}
          <motion.div 
            variants={visualContainer}
            className="lg:col-span-7 relative h-[600px] w-full flex items-center justify-center z-10"
          >
            {/* Profile Cards */}
            <div className="relative w-full h-full max-w-[600px] z-20">
              {TEAMMATES.map((teammate) => (
                <div key={teammate.name} className={`absolute ${teammate.pos}`}>
                  <Card className="flex items-center gap-3 p-3 w-[180px] sm:w-[200px] bg-[#0a0a0c]/60 backdrop-blur border-neutral-800 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:border-primary/50 transition-colors cursor-default rounded-full pr-6">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-b from-neutral-700 to-neutral-900 flex items-center justify-center font-bold text-white shrink-0 overflow-hidden border border-neutral-700">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${teammate.name}&backgroundColor=transparent`} alt={teammate.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-neutral-50 truncate">{teammate.name}</h4>
                      <p className="text-[9px] sm:text-[10px] text-neutral-400 truncate mb-0.5">{teammate.role}</p>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-primary">
                        <Star size={10} className="fill-primary text-primary" />
                        {teammate.rating}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
