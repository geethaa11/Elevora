import { Navigate, useNavigate } from "react-router-dom";
import { ScoreCard } from "../../components/ScoreCard.jsx";
import Button from "../../components/Button.jsx";
import { useAppState } from "../../context/AppState.jsx";

export default function PitchAnalysisResult() {
  const navigate = useNavigate();
  const { demoCoachResult: result } = useAppState();

  if (!result) return <Navigate to="/demo-coach" replace />;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header className="flex flex-col items-center gap-2 text-center">
        <p className="font-display text-display text-gold">{result.overallScore} / 10</p>
        <p className="text-body text-neutral-500">Pitch score</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries(result.metrics).map(([label, value]) => (
          <ScoreCard key={label} label={label} value={value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-small font-semibold uppercase tracking-wide text-neutral-500">What you did well</p>
          <ul className="flex flex-col gap-1.5">
            {result.wentWell.map((item) => (
              <li key={item} className="flex items-start gap-2 text-body text-neutral-200">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-small font-semibold uppercase tracking-wide text-neutral-500">
            What needs improvement
          </p>
          <ul className="flex flex-col gap-1.5">
            {result.needsImprovement.map((item) => (
              <li key={item} className="flex items-start gap-2 text-body text-neutral-200">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
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
