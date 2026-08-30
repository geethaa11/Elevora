import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { GraduationCap, ArrowRight, Star, Clock, CheckCircle, Shield } from 'lucide-react';

const FEATURED_MENTORS = [
  {
    id: "m1",
    name: "Dr. Aris Thorne",
    title: "Principal AI Scientist",
    organization: "DeepMind",
    domain: "AI/ML",
    bio: "10+ years in AI research, deep learning, and large language model architecture.",
    availability: "Mon & Wed, 4-6 PM EST",
    skills: ["AI/ML", "Python", "PyTorch", "LLMs"]
  },
  {
    id: "m2",
    name: "Sarah Chen",
    title: "VP of Engineering",
    organization: "Stripe",
    domain: "Fintech",
    bio: "Building scalable financial infrastructure and high-throughput distributed systems.",
    availability: "Tue & Thu, 5-7 PM PST",
    skills: ["System Design", "Backend", "Go", "Distributed Systems"]
  },
  {
    id: "m3",
    name: "Alex Rivera",
    title: "Founder & Managing Director",
    organization: "LaunchPad Ventures",
    domain: "Startups",
    bio: "Serial entrepreneur with 2 exits. Dedicated to helping student hackathon teams scale into startups.",
    availability: "Fridays, 2-5 PM EST",
    skills: ["Product Strategy", "Pitching", "Fundraising", "GTM"]
  },
  {
    id: "m4",
    name: "Priya Patel",
    title: "Lead UI/UX Designer",
    organization: "Figma",
    domain: "Design",
    bio: "Passionate about crafting intuitive design systems and accessible user interfaces.",
    availability: "Weekdays, 6-7 PM IST",
    skills: ["UI/UX", "Figma", "Design Systems", "Prototyping"]
  }
];

export function MentorSection() {
  return (
    <section id="mentors" className="relative py-24 bg-[#0D0D0F] border-t border-neutral-900 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 inline-block">
              Expert Guidance Network
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-50 tracking-tight leading-tight">
              Build with guidance.
            </h2>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl">
              Get practical advice from mentors who can help you strengthen your idea, technology and final presentation.
            </p>
          </div>

          <Link to="/mentors">
            <Button 
              variant="ghost" 
              className="rounded-full border border-neutral-700 hover:border-purple-500 text-neutral-300 hover:text-purple-400 transition-all flex items-center gap-2"
            >
              <GraduationCap size={16} />
              Explore Mentors
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* Mentor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_MENTORS.map((m, idx) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col justify-between p-6 rounded-2xl border border-neutral-800 bg-[#121216]/90 backdrop-blur-md hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Avatar & Domain Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-purple-400 text-base group-hover:scale-105 transition-transform">
                    {m.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                    {m.domain}
                  </span>
                </div>

                {/* Name & Title */}
                <h3 className="font-display text-lg font-bold text-neutral-100 group-hover:text-purple-300 transition-colors leading-snug">
                  {m.name}
                </h3>
                <p className="text-xs font-semibold text-primary mb-1">
                  {m.title}
                </p>
                <p className="text-xs text-neutral-400 font-medium mb-3">
                  {m.organization}
                </p>

                {/* Bio */}
                <p className="text-neutral-300 text-xs leading-relaxed mb-4 line-clamp-3">
                  {m.bio}
                </p>
              </div>

              <div>
                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mb-5">
                  {m.skills.map((sk, sIdx) => (
                    <span key={sIdx} className="text-[10px] text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Availability */}
                <div className="pt-3 border-t border-neutral-800/80 mb-4 text-[11px] text-neutral-400 flex items-center gap-1.5">
                  <Clock size={13} className="text-purple-400 shrink-0" />
                  <span className="truncate">{m.availability}</span>
                </div>

                {/* Action button */}
                <Link to="/mentors">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center text-xs font-semibold rounded-xl border border-neutral-700 group-hover:border-purple-500 group-hover:bg-purple-500/10 group-hover:text-purple-300 transition-all"
                  >
                    Request Guidance
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
