import { Navigate, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import Badge from "../../components/Badge.jsx";
import { useAppState } from "../../context/AppState.jsx";

export default function ImprovedPitch() {
  const navigate = useNavigate();
  const { demoCoachResult: result } = useAppState();

  if (!result) return <Navigate to="/demo-coach" replace />;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header className="flex flex-col gap-1">
        <Badge tone="ai">AI Powered</Badge>
        <h1 className="mt-2 font-display text-h1 text-neutral-0">Improved 60-Second Pitch</h1>
      </header>

      <div className="rounded-card border border-ai/30 bg-ai/10 p-6">
        <p className="text-body leading-relaxed text-neutral-0">{result.improvedPitch}</p>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-neutral-700 pt-6">
        <Button variant="secondary">Practice Again</Button>
        <Button variant="ai" onClick={() => navigate("/demo-coach/mock-judge")}>
          Mock Judge
        </Button>
      </div>
    </div>
  );
}
