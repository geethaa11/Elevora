import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Rocket, Cpu, Layers, HeartPulse, Sprout, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const hackathonTemplates = [
  {
    id: "tpl-ai-hub",
    title: "AI / ML Innovation Hub",
    category: "Artificial Intelligence",
    icon: Cpu,
    organizer: "Elevora AI Labs",
    prize: "₹1,50,000+",
    difficulty: "Advanced",
    stack: ["PyTorch", "Vector DB", "FastAPI", "React"],
    description: "End-to-end template for building RAG applications, LLM agents, and real-time inference pipelines with pre-built evaluation hooks.",
    badgeColor: "border-primary/60 text-primary bg-primary/10",
  },
  {
    id: "tpl-web3-fintech",
    title: "Web3 Financial Protocol",
    category: "DeFi & Blockchain",
    icon: Layers,
    organizer: "Devfolio Sprint",
    prize: "$15,000",
    difficulty: "Intermediate",
    stack: ["Solidity", "Ethers.js", "Next.js", "IPFS"],
    description: "Decentralized finance protocol template featuring audited smart contract scaffolding, Web3 wallet integration, and automated testing.",
    badgeColor: "border-purple-500/60 text-purple-400 bg-purple-500/10",
  },
  {
    id: "tpl-govtech-portal",
    title: "Civic Tech & GovTech Portal",
    category: "Governance",
    icon: Rocket,
    organizer: "Digital India Foundation",
    prize: "₹2,00,000",
    difficulty: "Beginner Friendly",
    stack: ["React", "Node.js", "PostGIS", "Tailwind"],
    description: "Open governance platform template with GIS mapping, citizen complaint routing, and real-time public service analytics.",
    badgeColor: "border-semantic-success/60 text-semantic-success bg-semantic-success/10",
  },
  {
    id: "tpl-healthtech-ai",
    title: "HealthTech Diagnostic AI",
    category: "Healthcare",
    icon: HeartPulse,
    organizer: "SheBuilds Foundation",
    prize: "₹1,00,000",
    difficulty: "Intermediate",
    stack: ["Python", "TensorFlow", "Health API", "Vite"],
    description: "Medical diagnostic assistant template with telemetry visualization, secure patient data schema, and instant triage API.",
    badgeColor: "border-rose-500/60 text-rose-400 bg-rose-500/10",
  },
  {
    id: "tpl-agritech-iot",
    title: "AgriTech & Sustainability IoT",
    category: "Climate & Agri",
    icon: Sprout,
    organizer: "National Agri Tech",
    prize: "₹80,000",
    difficulty: "Beginner Friendly",
    stack: ["IoT Sensors", "React", "Firebase", "Tailwind"],
    description: "Smart crop monitoring & soil moisture sensor template with predictive climate alerts and market connectivity tools.",
    badgeColor: "border-amber-500/60 text-amber-400 bg-amber-500/10",
  },
];

export function HackathonTemplateCarousel({ templates = hackathonTemplates, title = "Featured Hackathon Templates" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const AUTO_PLAY_INTERVAL = 5000; // 5 seconds
  const PROGRESS_TICK = 50; // update progress every 50ms

  const total = templates.length;

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Circular index calculations
  const getPrevIndex = useCallback((index) => (index - 1 + total) % total, [total]);
  const getNextIndex = useCallback((index) => (index + 1) % total, [total]);

  // Handle slide movement & reset 5-second timer
  const goToSlide = useCallback((newIndex) => {
    setCurrentIndex(newIndex);
    setProgress(0);
  }, []);

  const handleNext = useCallback(() => {
    goToSlide((currentIndex + 1) % total);
  }, [currentIndex, total, goToSlide]);

  const handlePrev = useCallback(() => {
    goToSlide((currentIndex - 1 + total) % total);
  }, [currentIndex, total, goToSlide]);

  // Auto-play interval & smooth progress ticker
  useEffect(() => {
    if (isPaused || shouldReduceMotion || total <= 1) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const startTime = Date.now();
    const startProgress = progress;

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, startProgress + (elapsed / AUTO_PLAY_INTERVAL) * 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressIntervalRef.current);
        handleNext();
      }
    }, PROGRESS_TICK);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPaused, shouldReduceMotion, total, handleNext, progress]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  const prevIndex = getPrevIndex(currentIndex);
  const nextIndex = getNextIndex(currentIndex);

  const prevTemplate = templates[prevIndex];
  const currTemplate = templates[currentIndex];
  const nextTemplate = templates[nextIndex];

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Hackathon Templates Carousel"
      className="relative w-full max-w-7xl mx-auto flex flex-col gap-6 py-6 px-4 sm:px-6 overflow-x-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-2xl"
    >
      {/* Header with Title and Status Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-50 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#FFD700] animate-pulse" />
            <span>{title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Auto-advancing every 5 seconds. Hover or touch to pause.
          </p>
        </div>

        {/* Arrow Navigation Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handlePrev}
            aria-label="Previous template"
            className="flex items-center justify-center p-2.5 rounded-full border border-neutral-700 bg-surface/90 text-neutral-200 hover:border-[#D4AF37] hover:text-[#FFD700] hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-200 shadow-md active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next template"
            className="flex items-center justify-center p-2.5 rounded-full border border-neutral-700 bg-surface/90 text-neutral-200 hover:border-[#D4AF37] hover:text-[#FFD700] hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-200 shadow-md active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 3-Card Carousel Container */}
      <div className="relative w-full min-h-[380px] sm:min-h-[400px] flex items-center justify-center py-4 select-none">
        <div className="w-full flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          
          {/* PREVIOUS CARD (Left - faint, smaller, 45% opacity) */}
          <div
            onClick={() => handlePrev()}
            className="hidden md:flex flex-col flex-1 max-w-[320px] rounded-2xl border border-neutral-800 bg-surface/40 p-5 cursor-pointer opacity-45 scale-[0.88] hover:opacity-75 transition-all duration-350 ease-out shadow-sm pointer-events-auto"
            style={{
              transition: shouldReduceMotion ? "none" : "all 350ms cubic-bezier(0.25, 0.8, 0.25, 1)",
            }}
          >
            <CardContent template={prevTemplate} isCurrent={false} />
          </div>

          {/* CURRENT CARD (Center - bright, embossed, 100% opacity, gold glow) */}
          <div
            className="flex flex-col w-full max-w-[460px] rounded-2xl p-6 sm:p-7 z-20 transition-all duration-350 ease-out pointer-events-auto"
            style={{
              opacity: 1,
              transform: "scale(1.02)",
              boxShadow: "0 14px 40px rgba(212, 175, 55, 0.28), 0 0 2px #D4AF37",
              border: "1.5px solid rgba(212, 175, 55, 0.8)",
              backgroundColor: "rgba(26, 26, 29, 0.98)",
              transition: shouldReduceMotion ? "none" : "all 350ms cubic-bezier(0.25, 0.8, 0.25, 1)",
            }}
          >
            <CardContent template={currTemplate} isCurrent={true} />
          </div>

          {/* NEXT CARD (Right - faint, smaller, 45% opacity) */}
          <div
            onClick={() => handleNext()}
            className="hidden md:flex flex-col flex-1 max-w-[320px] rounded-2xl border border-neutral-800 bg-surface/40 p-5 cursor-pointer opacity-45 scale-[0.88] hover:opacity-75 transition-all duration-350 ease-out shadow-sm pointer-events-auto"
            style={{
              transition: shouldReduceMotion ? "none" : "all 350ms cubic-bezier(0.25, 0.8, 0.25, 1)",
            }}
          >
            <CardContent template={nextTemplate} isCurrent={false} />
          </div>

        </div>
      </div>

      {/* Footer: Pagination Dots & Progress Indicator */}
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Subtle 5-second Progress Bar */}
        <div className="w-full max-w-xs h-1 rounded-full bg-neutral-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {templates.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to template ${idx + 1}: ${t.title}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-[#FFD700] shadow-sm shadow-[#FFD700]/50"
                  : "w-2.5 bg-neutral-700 hover:bg-neutral-500"
              }`}
            />
          ))}
        </div>

        {/* Status Hint */}
        {isPaused && (
          <span className="text-[11px] text-[#D4AF37] font-medium tracking-wide animate-pulse">
            ⏸ Auto-play paused (User interaction active)
          </span>
        )}
      </div>
    </section>
  );
}

function CardContent({ template, isCurrent }) {
  if (!template) return null;
  const Icon = template.icon || Rocket;

  return (
    <div className="flex flex-col gap-4 h-full justify-between">
      {/* Category & Badge */}
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${template.badgeColor}`}>
          <Icon className="h-3.5 w-3.5" />
          {template.category}
        </span>
        <span className="text-xs text-neutral-400 font-medium">
          {template.difficulty}
        </span>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className={`font-display font-bold leading-tight text-neutral-50 ${isCurrent ? "text-xl sm:text-2xl text-[#FFD700]" : "text-lg text-neutral-200"}`}>
          {template.title}
        </h3>
        <p className="text-xs text-neutral-400 mt-1 font-medium">
          Organized by <strong className="text-neutral-200">{template.organizer}</strong>
        </p>
        <p className={`mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed ${isCurrent ? "line-clamp-3" : "line-clamp-2 opacity-80"}`}>
          {template.description}
        </p>
      </div>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {template.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-neutral-700/80 bg-neutral-900/80 px-2 py-0.5 text-[11px] text-neutral-300 font-mono"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Footer: Prize & Action Button */}
      <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3 mt-auto">
        <div>
          <span className="text-[10px] uppercase text-neutral-400 tracking-wider">Prize Pool</span>
          <p className="text-sm font-bold text-[#FFD700]">{template.prize}</p>
        </div>

        <Link to="/signup">
          <button
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              isCurrent
                ? "bg-[#D4AF37] text-neutral-950 hover:bg-[#FFD700] shadow-md shadow-[#D4AF37]/20"
                : "border border-neutral-700 text-neutral-300 hover:border-neutral-500"
            }`}
          >
            <span>Use Template</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HackathonTemplateCarousel;
