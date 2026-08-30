import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getHackathons } from '../services/hackathonService';
import { 
  Compass, 
  Users, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ChevronRight,
  UserCheck,
  Target,
  Award,
  Layers
} from 'lucide-react';

const FALLBACK_HACKATHONS = [
  {
    id: "h1",
    name: "Global AI Innovators Hackathon 2026",
    organization: "DeepMind & OpenAI",
    domain: "AI/ML",
    deadline: "2026-09-15",
    prize: "₹5,00,000",
    mode: "Online"
  },
  {
    id: "h2",
    name: "FinTech Revolution Buildathon",
    organization: "Stripe & Y Combinator",
    domain: "Fintech",
    deadline: "2026-09-20",
    prize: "$25,000",
    mode: "Hybrid"
  },
  {
    id: "h3",
    name: "Web3 & Zero-Knowledge Challenge",
    organization: "Ethereum Foundation",
    domain: "Blockchain",
    deadline: "2026-10-01",
    prize: "$15,000",
    mode: "Online"
  }
];

const FEATURED_MENTORS = [
  {
    id: "m1",
    name: "Dr. Aris Thorne",
    title: "Principal AI Scientist",
    org: "DeepMind",
    domain: "AI/ML"
  },
  {
    id: "m2",
    name: "Sarah Chen",
    title: "VP of Engineering",
    org: "Stripe",
    domain: "Fintech"
  }
];

export function Home() {
  const { currentUser } = useAuth();
  const [hackathonsList, setHackathonsList] = useState(FALLBACK_HACKATHONS);

  // Extract display name or fallback
  const userName = currentUser?.displayName || currentUser?.name || currentUser?.email?.split('@')[0] || 'Student Hacker';
  const userEmail = currentUser?.email || 'student@elevora.edu';

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getHackathons();
        if (data && Array.isArray(data) && data.length > 0) {
          setHackathonsList(data.slice(0, 3));
        }
      } catch (err) {
        console.log("Using fallback hackathon data in dashboard:", err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-8 pb-12">
      
      {/* 1. Welcome Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-[#121216]/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#996515] to-[#D4AF37] p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <div className="w-full h-full rounded-2xl bg-[#0D0D0F] flex items-center justify-center text-primary font-black text-xl">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-50">
                  Welcome back, {userName}!
                </h1>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Active Hacker
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-neutral-400">
                Continue your hackathon journey: discover challenges, assemble your AI-matched team, and validate your project.
              </p>
            </div>
          </div>

          <Link to="/profile">
            <Button variant="ghost" size="sm" className="rounded-full border border-neutral-700 hover:border-primary text-neutral-300 hover:text-primary">
              View My Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Quick Actions Grid */}
      <div>
        <h2 className="font-display text-base font-bold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Zap size={16} className="text-primary" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link to="/hackathons" className="group p-5 rounded-2xl border border-neutral-800 bg-[#121216]/80 hover:border-primary/50 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-neutral-100 group-hover:text-primary transition-colors">
              Explore Hackathons
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Find global AI, Web3, & Fintech events
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
              Browse Hub <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>

          <Link to="/team-builder" className="group p-5 rounded-2xl border border-neutral-800 bg-[#121216]/80 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-neutral-100 group-hover:text-emerald-400 transition-colors">
              Build My Team
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              AI-matched complementary teammates
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              Match Teammates <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>

          <Link to="/mentors" className="group p-5 rounded-2xl border border-neutral-800 bg-[#121216]/80 hover:border-purple-500/50 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-neutral-100 group-hover:text-purple-400 transition-colors">
              Find a Mentor
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Get technical & pitch guidance
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
              Explore Mentors <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>

          <Link to="/validator" className="group p-5 rounded-2xl border border-neutral-800 bg-[#121216]/80 hover:border-blue-500/50 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-neutral-100 group-hover:text-blue-400 transition-colors">
              Validate My Idea
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              AI feedback on feasibility & design
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
              Check Idea <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>

        </div>
      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Hackathons & Team Builder */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Hackathons Section */}
          <Card className="p-6 border-neutral-800 bg-[#121216]/90 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-100">
                  Upcoming & Recommended Hackathons
                </h3>
                <p className="text-xs text-neutral-400">
                  Verified challenges matching your tech interests
                </p>
              </div>
              <Link to="/hackathons" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-4">
              {hackathonsList.map((h) => (
                <div key={h.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-700 transition-all gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        {h.domain}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {h.mode || 'Online'}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-neutral-100">
                      {h.name}
                    </h4>
                    <p className="text-xs text-neutral-400">by {h.organization}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <div className="text-xs text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} className="text-neutral-500" />
                        <span>{h.deadline}</span>
                      </div>
                      {h.prize && (
                        <div className="text-primary font-semibold text-[11px] mt-0.5">
                          {h.prize}
                        </div>
                      )}
                    </div>

                    <Link to={`/hackathons/${h.id}`}>
                      <Button variant="secondary" size="sm" className="text-xs border-neutral-700">
                        Explore
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Team Matching Feature Card */}
          <Card className="p-6 border-neutral-800 bg-[#121216]/90 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 inline-block mb-3">
                  AI Compatibility Matching
                </span>
                <h3 className="font-display text-xl font-bold text-neutral-50">
                  Build your ideal hackathon team
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
                  Elevora evaluates skills, preferred roles, availability time, and hackathon experience to recommend teammates who complement your strengths.
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                    Frontend + AI/ML Synergy
                  </span>
                  <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                    Time Overlap Check
                  </span>
                  <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                    Role Complementarity
                  </span>
                </div>
              </div>

              <Link to="/team-builder">
                <Button variant="primary" className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-black font-bold border-none shrink-0">
                  Launch Team Builder <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
            </div>
          </Card>

        </div>

        {/* Right Column (4 cols): Mentor Preview & Progress Timeline */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Hackathon Progress Roadmap */}
          <Card className="p-6 border-neutral-800 bg-[#121216]/90 backdrop-blur-md">
            <h3 className="font-display text-base font-bold text-neutral-100 mb-1">
              Hackathon Roadmap
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Your 4-step preparation workflow
            </p>

            <div className="space-y-4 relative">
              {[
                { step: '01', title: 'DISCOVER', desc: 'Find your target hackathon', active: true },
                { step: '02', title: 'MATCH', desc: 'Find complementary teammates', active: true },
                { step: '03', title: 'BUILD', desc: 'Develop solution with mentors', active: false },
                { step: '04', title: 'PRESENT', desc: 'Validate pitch with AI Coach', active: false }
              ].map((s, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${s.active ? 'border-primary bg-primary/20 text-primary' : 'border-neutral-800 bg-neutral-900 text-neutral-500'}`}>
                    {s.step}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-200">{s.title}</div>
                    <div className="text-[11px] text-neutral-400">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Mentors Preview */}
          <Card className="p-6 border-neutral-800 bg-[#121216]/90 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-neutral-100">
                Mentor Marketplace
              </h3>
              <Link to="/mentors" className="text-xs font-semibold text-purple-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {FEATURED_MENTORS.map((m) => (
                <div key={m.id} className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-purple-400">
                      {m.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-200">{m.name}</div>
                      <div className="text-[10px] text-neutral-400">{m.title} @ {m.org}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {m.domain}
                  </span>
                </div>
              ))}
            </div>

            <Link to="/mentors" className="mt-4 block">
              <Button variant="ghost" className="w-full text-xs justify-center border border-neutral-800 text-neutral-300 hover:text-white">
                Request Mentor Guidance
              </Button>
            </Link>
          </Card>

          {/* Recommended Activity Guidance Checklist */}
          <Card className="p-6 border-neutral-800 bg-[#121216]/90 backdrop-blur-md">
            <h3 className="font-display text-base font-bold text-neutral-100 mb-3 flex items-center gap-2">
              <Target size={16} className="text-primary" />
              Recommended Next Steps
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-neutral-300 p-2 rounded bg-neutral-900/60 border border-neutral-800/60">
                <CheckCircle2 size={15} className="text-primary shrink-0" />
                <span>Complete skills & availability in profile</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300 p-2 rounded bg-neutral-900/60 border border-neutral-800/60">
                <CheckCircle2 size={15} className="text-primary shrink-0" />
                <span>Explore target hackathon challenge</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300 p-2 rounded bg-neutral-900/60 border border-neutral-800/60">
                <CheckCircle2 size={15} className="text-neutral-500 shrink-0" />
                <span>Match with complementary teammates</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300 p-2 rounded bg-neutral-900/60 border border-neutral-800/60">
                <CheckCircle2 size={15} className="text-neutral-500 shrink-0" />
                <span>Validate pitch text with AI Coach</span>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}

export default Home;
