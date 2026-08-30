import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Users, Sparkles, CheckCircle2, ArrowRight, Shield, Zap, Clock, Award } from 'lucide-react';

const sampleTeammates = [
  {
    role: 'AI Developer',
    name: 'Maya Lin',
    match: 92,
    skills: ['Python', 'PyTorch', 'LLMs'],
    availability: '6 PM - 10 PM',
    hackathons: '3 Participated • 1 Won',
    accentColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
  },
  {
    role: 'UI/UX Designer',
    name: 'Samira Patel',
    match: 88,
    skills: ['Figma', 'User Research', 'Prototyping'],
    availability: '5 PM - 9 PM',
    hackathons: '4 Participated • 1 Won',
    accentColor: 'border-amber-500/40 bg-amber-500/10 text-amber-400'
  },
  {
    role: 'Backend Engineer',
    name: 'Devon Vance',
    match: 95,
    skills: ['Go', 'Docker', 'PostgreSQL'],
    availability: 'Flexible',
    hackathons: '2 Participated',
    accentColor: 'border-blue-500/40 bg-blue-500/10 text-blue-400'
  }
];

export function AiTeamMatchingSection() {
  return (
    <section id="teaming" className="relative py-24 bg-[#0D0D0F] border-t border-neutral-900 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Value Prop */}
          <div className="lg:col-span-5 flex flex-col items-start">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide mb-4">
              <Sparkles size={14} />
              <span>AI-powered compatibility matching</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-50 tracking-tight leading-tight mb-6">
              Don't just find teammates. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#FDE08B] via-[#D4AF37] to-[#996515] bg-clip-text text-transparent">
                Find the right team.
              </span>
            </h2>

            <p className="text-neutral-300 text-base leading-relaxed mb-8">
              Elevora evaluates skills, interests, preferred roles and availability to recommend teammates who complement your strengths.
            </p>

            {/* Feature Checklist */}
            <div className="flex flex-col gap-3 mb-8 w-full">
              {[
                'Skill Complementarity & Domain Synergy',
                'Timezone & Schedule Overlap Checking',
                'Balanced Tech Stack & Role Coverage',
                'Hackathon Experience & Track Record'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-neutral-200">
                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Link to="/team-builder">
              <Button 
                variant="primary" 
                size="lg" 
                className="px-7 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#996515] text-black font-bold border-none shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:opacity-95 flex items-center gap-2"
              >
                <Users size={18} />
                Find Teammates Now
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {/* Right Column: Visual Team Match Showcase Card */}
          <div className="lg:col-span-7">
            
            <div className="relative rounded-3xl border border-neutral-800 bg-[#121216]/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
              
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#996515] to-[#D4AF37] p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                    <div className="w-full h-full rounded-2xl bg-[#0D0D0F] flex items-center justify-center text-primary font-black text-sm">
                      YOU
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-neutral-50">Your Profile</h3>
                    <p className="text-xs text-neutral-400">Frontend Developer • React & TypeScript</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <Zap size={14} />
                  <span>Optimal Synergy Found</span>
                </div>
              </div>

              {/* Recommended Teammate Cards List */}
              <div className="mt-6 flex flex-col gap-4">
                
                {sampleTeammates.map((member, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-neutral-800/80 bg-[#16161c] hover:border-neutral-700 transition-all gap-4 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-primary text-sm group-hover:scale-105 transition-transform">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-sm text-neutral-100">{member.name}</h4>
                          <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                            {member.role}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {member.skills.map((sk, sIdx) => (
                            <span key={sIdx} className="text-[10px] text-neutral-300 bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                      <div className="text-right sm:text-left text-[11px] text-neutral-400">
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-neutral-500" />
                          <span>{member.availability}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-500 mt-0.5">
                          <Award size={12} />
                          <span>{member.hackathons}</span>
                        </div>
                      </div>

                      <div className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1 ${member.accentColor}`}>
                        <span>{member.match}%</span>
                        <span className="text-[9px] uppercase font-semibold">Match</span>
                      </div>
                    </div>
                  </motion.div>
                ))}

              </div>

              {/* Footer Note */}
              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Shield size={14} className="text-primary" />
                  Smart Complementary Role Allocation
                </span>
                <span className="text-neutral-300 font-medium">
                  Team Score: 92/100
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
