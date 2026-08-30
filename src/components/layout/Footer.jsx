import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-[#070709] border-t border-neutral-800/80 pt-16 pb-12 text-neutral-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800/60">
          
          {/* Brand & Bio Column */}
          <div className="md:col-span-5 flex flex-col items-start pr-0 md:pr-6">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#996515] via-[#D4AF37] to-[#FDE08B] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                <Sparkles className="w-4 h-4 text-black font-bold" />
              </div>
              <span className="font-display text-xl font-black tracking-widest text-neutral-50 group-hover:text-primary transition-colors">
                ELEVORA
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6 max-w-sm">
              Elevora is the definitive hackathon discovery and team-building platform for students to discover challenges, form complementary teams, and pitch winning projects.
            </p>

            <div className="flex items-center gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Twitter"
                className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-display text-sm font-bold text-neutral-200 uppercase tracking-wider mb-4">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/hackathons" className="hover:text-primary transition-colors">
                  Hackathon Explorer
                </Link>
              </li>
              <li>
                <Link to="/team-builder" className="hover:text-primary transition-colors">
                  AI Team Builder
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="hover:text-primary transition-colors">
                  Mentor Marketplace
                </Link>
              </li>
              <li>
                <Link to="/validator" className="hover:text-primary transition-colors">
                  AI Idea Validator
                </Link>
              </li>
              <li>
                <Link to="/demo-coach" className="hover:text-primary transition-colors">
                  AI Demo Coach
                </Link>
              </li>
            </ul>
          </div>

          {/* Company / Support */}
          <div className="md:col-span-4">
            <h4 className="font-display text-sm font-bold text-neutral-200 uppercase tracking-wider mb-4">
              Resources & About
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#home" className="hover:text-primary transition-colors">
                  About Elevora
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <a href="mailto:support@elevora.edu" className="hover:text-primary transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <div>
            © {new Date().getFullYear()} Elevora Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for hackathon teams everywhere with</span>
            <Heart size={12} className="text-red-500 fill-red-500 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
}
