import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ScoreCard } from "../../components/domain/ScoreCard.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { useAppState } from "../../context/AppStateContext.jsx";

function Section({ title, items, tone = "neutral" }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">{title}</p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-neutral-200">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "warn" ? "bg-semantic-warning" : "bg-primary"}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ValidatorResult() {
  const navigate = useNavigate();
  const { validatorResult: result } = useAppState();

  if (!result) return <Navigate to="/validator" replace />;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 py-4">
      <header className="flex flex-col items-center gap-2 text-center">
        <Badge variant="ai">AI Powered Validation</Badge>
        <p className="font-display text-4xl font-bold text-primary">{result.overallScore} / 10</p>
        <p className="text-sm text-neutral-400">Overall Idea Feasibility & Impact Score</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(result.metrics).map(([label, value]) => (
          <ScoreCard key={label} label={label} value={value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Section title="Strengths" items={result.strengths} />
        <Section title="Weaknesses" items={result.weaknesses} tone="warn" />
        <Section title="Suggested Features" items={result.suggestedFeatures} />
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Recommended Tech Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.recommendedTechStack.map((t) => (
              <Badge key={t} variant="default">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Competitor Analysis</p>
        <p className="text-sm text-neutral-200 leading-relaxed">{result.competitorAnalysis}</p>
      </div>

      <Section title="Improvement Suggestions" items={result.improvementSuggestions} tone="warn" />

      <div className="flex flex-wrap items-center gap-3 border-t border-neutral-700 pt-6">
        <Button variant="secondary">Improve Idea</Button>
        <Button variant="secondary">Save Result</Button>
        <Button variant="ai" onClick={() => navigate("/demo-coach")}>
          Continue to Demo Coach
        </Button>
        <Link to="/team-builder" className="ml-auto text-xs text-neutral-400 hover:text-primary transition-colors">
          Need teammates? Find Teammates →
        </Link>
      </div>
    </div>
  );
}

export default ValidatorResult;
