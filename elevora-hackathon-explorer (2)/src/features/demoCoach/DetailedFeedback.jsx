import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Tabs } from "../../components/Fields.jsx";
import { useAppState } from "../../context/AppState.jsx";
import { mockJudgeQuestions } from "../../services/mockServices.js";

export default function DetailedFeedback() {
  const { demoCoachResult: result } = useAppState();
  const [tab, setTab] = useState("Feedback");

  if (!result) return <Navigate to="/demo-coach" replace />;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header>
        <h1 className="font-display text-h1 text-neutral-0">Detailed Feedback</h1>
      </header>

      <Tabs tabs={["Feedback", "Judge Questions", "Improved Pitch"]} active={tab} onChange={setTab} />

      {tab === "Feedback" && (
        <div className="flex flex-col gap-5">
          {Object.entries(result.feedbackByCategory).map(([category, detail]) => (
            <div key={category} className="rounded-card border border-neutral-700 bg-neutral-800 p-4">
              <p className="mb-2 font-display text-h4 text-neutral-0">{category}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-caption font-semibold uppercase text-neutral-500">Current issue</p>
                  <p className="text-small text-neutral-200">{detail.issue}</p>
                </div>
                <div>
                  <p className="text-caption font-semibold uppercase text-neutral-500">Why it matters</p>
                  <p className="text-small text-neutral-200">{detail.why}</p>
                </div>
                <div>
                  <p className="text-caption font-semibold uppercase text-neutral-500">How to improve</p>
                  <p className="text-small text-neutral-200">{detail.how}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Judge Questions" && (
        <ul className="flex flex-col gap-3">
          {mockJudgeQuestions.map((q, i) => (
            <li key={q} className="rounded-card border border-neutral-700 bg-neutral-800 p-4 text-body text-neutral-200">
              <span className="mr-2 text-gold">Q{i + 1}.</span>
              {q}
            </li>
          ))}
        </ul>
      )}

      {tab === "Improved Pitch" && (
        <div className="flex flex-col gap-4">
          <p className="rounded-card border border-ai/30 bg-ai/10 p-4 text-body text-neutral-0">{result.improvedPitch}</p>
          <Link to="/demo-coach/improved-pitch" className="text-small font-semibold text-gold hover:underline">
            View full improved pitch →
          </Link>
        </div>
      )}
    </div>
  );
}
