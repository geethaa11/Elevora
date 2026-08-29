import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Textarea } from "../../components/Fields.jsx";
import Button from "../../components/Button.jsx";
import { ProgressBar } from "../../components/ScoreCard.jsx";
import { mockJudgeQuestions } from "../../services/mockServices.js";

function mockGrade() {
  return {
    quality: 70 + Math.floor(Math.random() * 25),
    strengths: ["Clear answer", "Good understanding of the problem"],
    improve: ["Add measurable results", "Explain scalability"],
  };
}

export default function MockJudge() {
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
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" />
        <h1 className="font-display text-h1 text-neutral-0">Demo Ready</h1>
        <p className="text-body text-neutral-500">
          You've worked through the full journey — idea, pitch, feedback and judge practice. Go win it.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-h1 text-neutral-0">Mock Judge</h1>
        <p className="text-body text-neutral-500">Practice answering questions before demo day.</p>
      </header>

      <div>
        <p className="mb-2 text-small font-semibold text-neutral-500">
          Question {index + 1} / {total}
        </p>
        <ProgressBar value={index + 1} max={total} tone="ai" />
      </div>

      <p className="rounded-card border border-neutral-700 bg-neutral-800 p-4 text-body text-neutral-0">
        {mockJudgeQuestions[index]}
      </p>

      <Textarea
        placeholder="Type your answer..."
        rows={5}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={!!graded}
      />

      {graded && (
        <div className="rounded-card border border-neutral-700 bg-neutral-800 p-4">
          <p className="mb-2 font-display text-h4 text-gold">Answer Quality: {graded.quality}%</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-caption font-semibold uppercase text-neutral-500">Strengths</p>
              <ul className="mt-1 space-y-1 text-small text-neutral-200">
                {graded.strengths.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-caption font-semibold uppercase text-neutral-500">Improve</p>
              <ul className="mt-1 space-y-1 text-small text-neutral-200">
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
            {index + 1 >= total ? "Finish" : "Next Question"}
          </Button>
        )}
      </div>
    </div>
  );
}
