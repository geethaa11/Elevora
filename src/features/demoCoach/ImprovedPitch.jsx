import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { useAppState } from "../../context/AppStateContext.jsx";

export function ImprovedPitch() {
  const navigate = useNavigate();
  const { demoCoachResult: result } = useAppState();

  if (!result) return <Navigate to="/demo-coach" replace />;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <Badge variant="ai">AI Generated Pitch</Badge>
        <h1 className="mt-2 font-display text-3xl font-bold text-neutral-50">Improved 60-Second Pitch</h1>
      </header>

      <div className="rounded-xl border border-semantic-ai/30 bg-semantic-ai/10 p-6">
        <p className="text-base leading-relaxed text-neutral-50">{result.improvedPitch}</p>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-neutral-700 pt-6">
        <Button variant="secondary" onClick={() => navigate("/demo-coach")}>
          Practice Again
        </Button>
        <Button variant="ai" onClick={() => navigate("/demo-coach/mock-judge")}>
          Mock Judge Practice
        </Button>
      </div>
    </div>
  );
}

export default ImprovedPitch;
