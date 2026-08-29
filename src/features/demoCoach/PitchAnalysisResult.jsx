import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ScoreCard } from "../../components/domain/ScoreCard.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { useAppState } from "../../context/AppStateContext.jsx";

export function PitchAnalysisResult() {
  const navigate = useNavigate();
  const { demoCoachResult: result } = useAppState();

  if (!result) return <Navigate to="/demo-coach" replace />;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 py-4">
      <header className="flex flex-col items-center gap-2 text-center">
        <p className="font-display text-4xl font-bold text-primary">{result.overallScore} / 10</p>
        <p className="text-sm text-neutral-400">Overall Pitch Clarity & Presentation Score</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries(result.metrics).map(([label, value]) => (
          <ScoreCard key={label} label={label} value={value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">What you did well</p>
          <ul className="flex flex-col gap-2">
            {result.wentWell.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-neutral-200">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-semantic-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            What needs improvement
          </p>
          <ul className="flex flex-col gap-2">
            {result.needsImprovement.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-neutral-200">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-semantic-warning" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-700 pt-6">
        <Button variant="primary" onClick={() => navigate("/demo-coach/feedback")}>
          View Detailed Feedback
        </Button>
      </div>
    </div>
  );
}

export default PitchAnalysisResult;
