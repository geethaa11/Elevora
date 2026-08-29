import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAppState } from "../../context/AppStateContext.jsx";
import { mockJudgeQuestions } from "../../services/demoCoachService.js";

export function DetailedFeedback() {
  const { demoCoachResult: result } = useAppState();
  const [tab, setTab] = useState("Feedback");

  if (!result) return <Navigate to="/demo-coach" replace />;

  const tabs = ["Feedback", "Judge Questions", "Improved Pitch"];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 py-4">
      <header>
        <h1 className="font-display text-3xl font-bold text-neutral-50">Detailed Feedback</h1>
      </header>

      <div className="flex gap-1 border-b border-neutral-700 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              tab === t
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Feedback" && (
        <div className="flex flex-col gap-5">
          {Object.entries(result.feedbackByCategory).map(([category, detail]) => (
            <div key={category} className="rounded-xl border border-neutral-700 bg-surface p-4">
              <p className="mb-3 font-display text-lg font-bold text-neutral-50">{category}</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-neutral-400">Current issue</p>
                  <p className="text-sm text-neutral-200 mt-1">{detail.issue}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-neutral-400">Why it matters</p>
                  <p className="text-sm text-neutral-200 mt-1">{detail.why}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-neutral-400">How to improve</p>
                  <p className="text-sm text-neutral-200 mt-1">{detail.how}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Judge Questions" && (
        <ul className="flex flex-col gap-3">
          {mockJudgeQuestions.map((q, i) => (
            <li key={q} className="rounded-xl border border-neutral-700 bg-surface p-4 text-sm text-neutral-200">
              <span className="mr-2 text-primary font-bold">Q{i + 1}.</span>
              {q}
            </li>
          ))}
        </ul>
      )}

      {tab === "Improved Pitch" && (
        <div className="flex flex-col gap-4">
          <p className="rounded-xl border border-semantic-ai/30 bg-semantic-ai/10 p-5 text-sm text-neutral-50 leading-relaxed">
            {result.improvedPitch}
          </p>
          <Link to="/demo-coach/improved-pitch" className="text-sm font-semibold text-primary hover:underline">
            View full improved pitch & practice →
          </Link>
        </div>
      )}
    </div>
  );
}

export default DetailedFeedback;
