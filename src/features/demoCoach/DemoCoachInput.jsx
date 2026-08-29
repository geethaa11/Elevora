import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Input } from "../../components/ui/Input.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { useAppState } from "../../context/AppStateContext.jsx";
import { submitPitchForCoaching } from "../../services/demoCoachService.js";

export function DemoCoachInput() {
  const navigate = useNavigate();
  const { setDemoCoachResult } = useAppState();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    projectName: "",
    problem: "",
    solution: "",
    pitch: "",
    techStack: "",
    link: "",
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await submitPitchForCoaching(form);
    setDemoCoachResult(result);
    setLoading(false);
    navigate("/demo-coach/result");
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-4">
      <header>
        <h1 className="font-display text-3xl font-bold text-neutral-50">AI Demo Coach</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Get real-time feedback on your pitch, gain clarity, and refine your demo strategy.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Project Name *</label>
          <Input required value={form.projectName} onChange={set("projectName")} placeholder="e.g. Elevora AI" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Problem *</label>
          <Textarea required rows={3} value={form.problem} onChange={set("problem")} placeholder="Problem statement" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Solution *</label>
          <Textarea required rows={3} value={form.solution} onChange={set("solution")} placeholder="Proposed solution" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Your Pitch *</label>
          <Textarea
            required
            rows={6}
            value={form.pitch}
            onChange={set("pitch")}
            placeholder="Paste your 60-second pitch here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Technology Stack</label>
          <Input value={form.techStack} onChange={set("techStack")} placeholder="React, FastAPI, PostgreSQL" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">GitHub / Demo Link</label>
          <Input
            value={form.link}
            onChange={set("link")}
            placeholder="https://github.com/..."
          />
          <span className="text-xs text-neutral-400 mt-1 block">Optional repository or live demo link</span>
        </div>

        <Button type="submit" variant="ai" isLoading={loading} className="gap-2 self-start mt-2">
          <Sparkles className="h-4 w-4" />
          {loading ? "Analyzing your pitch..." : "Start Coaching"}
        </Button>
      </form>
    </div>
  );
}

export default DemoCoachInput;
