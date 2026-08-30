import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Users, Code, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    step: '01',
    label: 'DISCOVER',
    title: 'Find the right hackathon.',
    description: 'Explore upcoming global and regional hackathons filtered by domain, tech stack, prize pool, and deadlines.',
    icon: Compass,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/10'
  },
  {
    step: '02',
    label: 'MATCH',
    title: 'Find teammates who complement your skills.',
    description: 'Our AI engine evaluates skills, interests, roles, and availability to match you with compatible teammates.',
    icon: Users,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/10'
  },
  {
    step: '03',
    label: 'BUILD',
    title: 'Collaborate and develop your solution.',
    description: 'Work seamlessly with your team and get direct guidance from domain-expert mentors throughout development.',
    icon: Code,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-500/10'
  },
  {
    step: '04',
    label: 'PRESENT',
    title: 'Prepare your final demo and presentation.',
    description: 'Validate your solution architecture and refine your pitch text using our AI Demo Coach before judging.',
    icon: Award,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    bgColor: 'bg-blue-500/10'
  }
];

export function HowItWorks() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="how-it-works" className="relative py-24 bg-[#0A0A0C] border-t border-neutral-900 overflow-hidden">
      
      {/* Ambient background rays */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[300px] bg-gradient-to-l from-primary/10 to-transparent blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold tracking-widest text-primary uppercase mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            Simple 4-Step Process
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-50 tracking-tight leading-tight">
            From idea to hackathon-ready team.
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
            Follow a proven structure that eliminates the chaos of team building and project preparation.
          </p>
        </div>

        {/* 4 Steps Flow */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
        >
          
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-amber-500/30 via-emerald-500/30 to-blue-500/30 z-0 pointer-events-none" />

          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div key={idx} variants={item} className="relative z-10 flex flex-col h-full">
                
                {/* Step Card */}
                <div className="flex-1 p-6 rounded-2xl border border-neutral-800/90 bg-[#121216]/90 backdrop-blur-md flex flex-col justify-between hover:border-neutral-700 transition-all group">
                  <div>
                    {/* Number Badge & Icon Header */}
                    <div className="flex items-center justify-between mb-6">
                      <span className={`font-mono text-3xl font-black ${s.color} opacity-90`}>
                        {s.step}
                      </span>
                      <div className={`w-11 h-11 rounded-xl ${s.bgColor} border ${s.borderColor} flex items-center justify-center ${s.color}`}>
                        <Icon size={20} />
                      </div>
                    </div>

                    {/* Step Label */}
                    <div className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
                      {s.label}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg font-bold text-neutral-100 mb-3 group-hover:text-primary transition-colors leading-snug">
                      {s.title}
                    </h3>

                    {/* Description */}
                    <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  {/* Visual Step Marker */}
                  <div className="mt-6 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <span>Phase {idx + 1} of 4</span>
                    <span className={s.color}>Ready</span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Banner */}
        <div className="mt-16 text-center">
          <Link to="/login">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline group">
              Start your journey today <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}
