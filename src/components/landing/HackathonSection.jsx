import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Compass, Calendar, MapPin, Trophy, ArrowRight, Tag, ExternalLink } from 'lucide-react';
import { getHackathons } from '../../services/hackathonService';

// Default curated hackathons matching our backend database dataset
const FALLBACK_HACKATHONS = [
  {
    id: "h1",
    name: "Global AI Innovators Hackathon 2026",
    organization: "DeepMind & OpenAI",
    domain: "AI/ML",
    deadline: "2026-09-15",
    eligibility: "Students & Developers",
    registration_url: "https://hackathon.elevora.edu/ai-2026",
    description: "Build cutting-edge autonomous agents, generative AI workflows, and multi-modal neural systems.",
    prize: "₹5,00,000",
    mode: "Online"
  },
  {
    id: "h2",
    name: "FinTech Revolution Buildathon",
    organization: "Stripe & Y Combinator",
    domain: "Fintech",
    deadline: "2026-09-20",
    eligibility: "Open to All Students",
    registration_url: "https://hackathon.elevora.edu/fintech-2026",
    description: "Architect high-throughput decentralized payment protocols, fraud detection ML models, and banking APIs.",
    prize: "$25,000",
    mode: "Hybrid"
  },
  {
    id: "h3",
    name: "Web3 & Zero-Knowledge Challenge",
    organization: "Ethereum Foundation",
    domain: "Blockchain",
    deadline: "2026-10-01",
    eligibility: "Undergrad & Grad Students",
    registration_url: "https://hackathon.elevora.edu/web3-2026",
    description: "Pioneer smart contract optimizations, ZK-rollups, and secure Web3 decentralized applications.",
    prize: "$15,000",
    mode: "Online"
  },
  {
    id: "h4",
    name: "Cloud Native Architecture Hackathon",
    organization: "AWS & CNCF",
    domain: "DevOps",
    deadline: "2026-10-10",
    eligibility: "All University Students",
    registration_url: "https://hackathon.elevora.edu/cloud-2026",
    description: "Create resilient microservice architectures, Kubernetes auto-scaling operators, and serverless pipelines.",
    prize: "₹3,00,000",
    mode: "Online"
  }
];

export function HackathonSection() {
  const [hackathonsList, setHackathonsList] = useState(FALLBACK_HACKATHONS);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getHackathons();
        if (data && Array.isArray(data) && data.length > 0) {
          setHackathonsList(data.slice(0, 4));
        }
      } catch (err) {
        console.log("Using default curated hackathons list:", err);
      }
    }
    loadData();
  }, []);

  return (
    <section id="hackathons" className="relative py-24 bg-[#0A0A0C] border-t border-neutral-900 overflow-hidden">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-bold tracking-widest text-primary uppercase mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
              Hackathon Explorer Preview
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-50 tracking-tight leading-tight">
              Find your next challenge.
            </h2>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl">
              Discover verified hackathons across AI, Fintech, Web3, and Cloud computing.
            </p>
          </div>

          <Link to="/hackathons">
            <Button 
              variant="ghost" 
              className="rounded-full border border-neutral-700 hover:border-primary text-neutral-300 hover:text-primary transition-all flex items-center gap-2"
            >
              <Compass size={16} />
              View All Hackathons
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* Hackathon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hackathonsList.map((h, idx) => (
            <motion.div 
              key={h.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col justify-between p-6 rounded-2xl border border-neutral-800 bg-[#121216]/90 backdrop-blur-md hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Domain & Mode Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                    {h.domain || 'Tech'}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
                    <MapPin size={12} className="text-neutral-500" />
                    {h.mode || 'Online'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-bold text-neutral-100 group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                  {h.name}
                </h3>

                {/* Organization */}
                <p className="text-xs text-neutral-400 mb-4 font-medium">
                  by {h.organization || 'Elevora Host'}
                </p>

                {/* Description */}
                <p className="text-neutral-300 text-xs leading-relaxed mb-6 line-clamp-3">
                  {h.description || 'Join fellow students and build innovative projects in this hackathon.'}
                </p>
              </div>

              <div>
                {/* Meta details */}
                <div className="space-y-2 border-t border-neutral-800/80 pt-4 mb-5 text-xs text-neutral-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-neutral-500" />
                      Deadline:
                    </span>
                    <span className="font-semibold text-neutral-200">{h.deadline}</span>
                  </div>

                  {h.prize && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Trophy size={13} className="text-primary" />
                        Prize Pool:
                      </span>
                      <span className="font-bold text-primary">{h.prize}</span>
                    </div>
                  )}
                </div>

                {/* Action button */}
                <Link to={`/hackathons/${h.id || 'h1'}`}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center text-xs font-semibold rounded-xl border border-neutral-700 group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all"
                  >
                    Explore Challenge
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
