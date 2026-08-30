import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Users, GraduationCap, Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Compass,
    title: 'Hackathon Discovery',
    description: 'Find hackathons that match your interests, skills and goals.',
    badge: 'Explore Hub',
    link: '/hackathons',
    color: 'from-amber-500/20 to-amber-500/5',
    borderColor: 'group-hover:border-amber-500/50',
    iconColor: 'text-amber-400'
  },
  {
    icon: Users,
    title: 'AI Team Matching',
    description: 'Find teammates based on skills, interests, roles and availability.',
    badge: 'Smart Teaming',
    link: '/team-builder',
    color: 'from-emerald-500/20 to-emerald-500/5',
    borderColor: 'group-hover:border-emerald-500/50',
    iconColor: 'text-emerald-400'
  },
  {
    icon: GraduationCap,
    title: 'Mentor Guidance',
    description: 'Connect with mentors and get practical guidance throughout your journey.',
    badge: 'Expert Network',
    link: '/mentors',
    color: 'from-purple-500/20 to-purple-500/5',
    borderColor: 'group-hover:border-purple-500/50',
    iconColor: 'text-purple-400'
  },
  {
    icon: Sparkles,
    title: 'AI Project Coach',
    description: 'Validate and improve your project idea before the final presentation.',
    badge: 'Idea & Demo Coach',
    link: '/validator',
    color: 'from-blue-500/20 to-blue-500/5',
    borderColor: 'group-hover:border-blue-500/50',
    iconColor: 'text-blue-400'
  }
];

export function FeatureHighlights() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="features" className="relative py-20 bg-[#0D0D0F] border-t border-neutral-900 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-primary uppercase mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            Platform Core Capabilities
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-50 tracking-tight leading-tight">
            Everything you need to win your next hackathon.
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
            Elevora combines global hackathon discovery, intelligent team matching, expert mentorship, and AI-assisted pitch validation into one unified workflow.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div key={idx} variants={item}>
                <Link 
                  to={f.link}
                  className={`group relative flex flex-col justify-between h-full p-6 rounded-2xl border border-neutral-800 bg-[#121216]/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${f.borderColor}`}
                >
                  {/* Subtle top gradient header */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r ${f.color}`} />
                  
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700/60 flex items-center justify-center ${f.iconColor} group-hover:scale-110 transition-transform`}>
                        <Icon size={24} />
                      </div>
                      <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-800">
                        {f.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-neutral-100 group-hover:text-primary transition-colors mb-2">
                      {f.title}
                    </h3>
                    <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-semibold text-neutral-300 group-hover:text-primary transition-colors">
                    <span>Explore Feature</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
