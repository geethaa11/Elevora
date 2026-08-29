import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { ProgressBar } from "../../components/domain/ScoreCard.jsx";
import { mockJudgeQuestions } from "../../services/demoCoachService.js";

function mockGrade() {
  return {
    quality: 70 + Math.floor(Math.random() * 25),
    strengths: ["Clear answer structure", "Good understanding of core problem"],
    improve: ["Add concrete metrics or data", "Explain scalability under load"],
  };
}

export function MockJudge() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [graded, setGraded] = useState(null);
  const [done, setDone] = useState(false);

  const total = mockJudgeQuestions.length;

  const handleSubmit = () => {
    setGraded(mockGrade());
  };

  const handleNext = () => {
    setGraded(null);
    setAnswer("");
    if (index + 1 >= total) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (done) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-20 text-center">
        <CheckCircle2 className="h-14 w-14 text-semantic-success" />
        <h1 className="font-display text-3xl font-bold text-neutral-50">Demo Ready!</h1>
        <p className="text-sm text-neutral-400">
          You've worked through the complete journey — hackathon discovery, team formation, idea validation, pitch feedback, and mock judging. You're ready to win!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold text-neutral-50">Mock Judge</h1>
        <p className="text-sm text-neutral-400">Practice answering tough judge Q&A before demo day.</p>
      </header>

      <div>
        <p className="mb-2 text-xs font-semibold text-neutral-400">
          Question {index + 1} / {total}
        </p>
        <ProgressBar value={index + 1} max={total} tone="ai" />
      </div>

      <div className="rounded-xl border border-neutral-700 bg-surface p-4 text-base text-neutral-50">
        {mockJudgeQuestions[index]}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-200 mb-1.5">Your Response</label>
        <Textarea
          placeholder="Type your answer as if presenting to the judge..."
          rows={5}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={!!graded}
        />
      </div>

      {graded && (
        <div className="rounded-xl border border-neutral-700 bg-surface p-4">
          <p className="mb-3 font-display text-lg font-bold text-primary">Answer Quality: {graded.quality}%</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-neutral-400">Strengths</p>
              <ul className="mt-1 space-y-1 text-xs text-neutral-200">
                {graded.strengths.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-neutral-400">Improvement</p>
              <ul className="mt-1 space-y-1 text-xs text-neutral-200">
                {graded.improve.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!graded ? (
          <Button variant="primary" onClick={handleSubmit} disabled={!answer.trim()}>
            Submit Answer
          </Button>
        ) : (
          <Button variant="ai" onClick={handleNext}>
            {index + 1 >= total ? "Finish Practice" : "Next Question"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default MockJudge;
