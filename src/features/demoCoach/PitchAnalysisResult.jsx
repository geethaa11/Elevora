import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ScoreCard } from "../../components/domain/ScoreCard.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { useAppState } from "../../context/AppStateContext.jsx";

function AnimatedOverallScore({ score }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = typeof score === "number" ? score : parseFloat(score) || 0;
    const duration = 1500;
    const steps = 40;
    const stepTime = duration / steps;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayScore(target);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start * 10) / 10);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <p className="font-display text-5xl font-bold text-[#FFD700] drop-shadow-md">
      {displayScore} <span className="text-2xl text-neutral-400 font-normal">/ 10</span>
    </p>
  );
}

export function PitchAnalysisResult() {
  const navigate = useNavigate();
  const { demoCoachResult: result } = useAppState();

  if (!result) return <Navigate to="/demo-coach" replace />;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 py-4 animate-fade-in">
      <header className="flex flex-col items-center gap-2 text-center">
        <AnimatedOverallScore score={result.overallScore} />
        <p className="text-sm text-neutral-400">Overall Pitch Clarity & Presentation Score</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries(result.metrics).map(([label, value]) => (
          <ScoreCard key={label} label={label} value={value} tone="ai" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-800 bg-surface/60 p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">What you did well</p>
          <ul className="flex flex-col gap-2.5">
            {result.wentWell.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-200">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-semantic-success shadow-sm shadow-semantic-success/50" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-surface/60 p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            What needs improvement
          </p>
          <ul className="flex flex-col gap-2.5">
            {result.needsImprovement.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-200">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-semantic-warning shadow-sm shadow-semantic-warning/50" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-700/80 pt-6 flex justify-center">
        <Button variant="primary" onClick={() => navigate("/demo-coach/feedback")} className="px-6 py-2.5 text-sm">
          View Detailed Feedback →
        </Button>
      </div>
    </div>
  );
}

export default PitchAnalysisResult;
