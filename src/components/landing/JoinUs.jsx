import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ArrowRight, Star, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const MENTORS = [
  { name: 'Rohit Sharma', title: 'ML Engineer @ Google', rating: '4.9', reviews: 120, sessions: '10+', featured: false },
  { name: 'Ananya Mehta', title: 'Product Lead @ Microsoft', rating: '5.0', reviews: 200, sessions: '15+', featured: true },
  { name: 'Vivek Nair', title: 'CTO & Co-founder', rating: '4.8', reviews: 98, sessions: '8+', featured: false },
];

export function JoinUs() {
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
    <section id="mentors" className="relative flex min-h-[120vh] items-center py-24 overflow-hidden pointer-events-none">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:pl-32 relative z-10 pointer-events-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid lg:grid-cols-12 gap-12 items-center"
        >
          
          {/* Text Content (Slides from right) */}
          <div className="lg:col-span-4 flex flex-col items-start z-10">
            <motion.span variants={textItem} className="text-neutral-400 font-bold tracking-widest text-[10px] mb-4 uppercase">
              Learn from the best
            </motion.span>
            <motion.h2 variants={textItem} className="font-display text-4xl sm:text-5xl lg:text-5xl text-neutral-50 mb-6 leading-[1.1]">
              Get mentored by industry experts
            </motion.h2>
            <motion.p variants={textItem} className="text-neutral-400 text-sm sm:text-base mb-8 max-w-sm leading-relaxed">
              Connect with verified mentors, book 1:1 sessions, attend live Q&As and level up your journey.
            </motion.p>
            <motion.div variants={textItem}>
              <Link to="/signup">
                <Button variant="ghost" className="group rounded-full border border-neutral-700 hover:border-primary text-neutral-300 hover:text-primary transition-all">
                  Explore Mentors
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Visual: Carousel (Slides from left) */}
          <motion.div 
            variants={visualContainer}
            className="lg:col-span-8 relative w-full flex items-center justify-center z-10"
          >
            <div className="flex items-center gap-4 w-full relative z-20">
              {/* Left Arrow */}
              <button className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-[#111] text-neutral-400 hover:text-primary hover:border-primary transition-colors">
                <ChevronLeft size={16} />
              </button>

              <div className="flex-1 flex gap-4 lg:gap-6 justify-center items-center">
                {MENTORS.map((mentor) => (
                  <Card 
                    key={mentor.name}
                    className={`flex flex-col items-center text-center p-5 sm:p-6 transition-all duration-300 w-[200px] sm:w-[220px] ${
                      mentor.featured 
                        ? 'border-primary/50 shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-[#0a0a0c]/80 backdrop-blur scale-105 z-20' 
                        : 'border-neutral-800 bg-[#111113]/60 backdrop-blur scale-95 opacity-50 sm:opacity-100 z-10 hidden sm:flex'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full border border-neutral-700 bg-neutral-900 overflow-hidden mb-3">
                       <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${mentor.name}&backgroundColor=transparent`} alt={mentor.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <h3 className="font-bold text-sm text-neutral-50 mb-1">{mentor.name}</h3>
                    <p className="text-[10px] text-neutral-400 mb-2 h-6">{mentor.title}</p>
                    
                    <div className="flex items-center gap-1 bg-[#1a1a1c] border border-neutral-800 px-2 py-0.5 rounded-full mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-[8px] text-neutral-300 uppercase tracking-wider">Mentor</span>
                    </div>

                    <div className="flex items-center justify-center gap-3 w-full border-t border-neutral-800 pt-3 mb-4">
                      <div className="flex items-center gap-1 text-[10px] text-primary">
                        <Star size={10} className="fill-primary text-primary" />
                        {mentor.rating} <span className="text-neutral-500">({mentor.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                        <RotateCcw size={10} />
                        {mentor.sessions} Sessions
                      </div>
                    </div>

                    <Link to="/signup" className="w-full">
                      <Button 
                        variant={mentor.featured ? 'primary' : 'ghost'} 
                        className={`w-full text-xs h-8 ${mentor.featured ? 'bg-gradient-to-b from-[#D4AF37] to-[#996515] text-black border-none hover:opacity-90' : 'border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800/50'}`}
                      >
                        Book Session <ArrowRight size={12} className="ml-1" />
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Right Arrow */}
              <button className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-[#111] text-neutral-400 hover:text-primary hover:border-primary transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
