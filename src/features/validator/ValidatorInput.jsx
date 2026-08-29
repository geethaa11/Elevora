import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Input } from "../../components/ui/Input.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { useAppState } from "../../context/AppStateContext.jsx";
import { submitIdeaForValidation } from "../../services/validatorService.js";

export function ValidatorInput() {
  const navigate = useNavigate();
  const { selectedHackathon, team, setValidatorResult } = useAppState();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    projectName: "",
    problem: "",
    solution: "",
    targetUsers: "",
    techStack: "",
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await submitIdeaForValidation(form);
    setValidatorResult(result);
    setLoading(false);
    navigate("/validator/result");
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-4">
      <header>
        <h1 className="font-display text-3xl font-bold text-neutral-50">Validate Your Idea</h1>
        <p className="text-sm text-neutral-400 mt-1">Tell us about your idea so Elevora AI can analyze it.</p>
        {selectedHackathon && (
          <p className="mt-2 text-sm text-primary font-semibold">
            For {selectedHackathon.name}
            {team.length > 0 && ` · Team of ${team.length + 1}`}
          </p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Project Name *</label>
          <Input required value={form.projectName} onChange={set("projectName")} placeholder="e.g. Elevora AI" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Problem Statement *</label>
          <Textarea
            required
            rows={4}
            value={form.problem}
            onChange={set("problem")}
            placeholder="What problem are you solving, and for whom?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Proposed Solution *</label>
          <Textarea
            required
            rows={4}
            value={form.solution}
            onChange={set("solution")}
            placeholder="How does your idea solve it?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Target Users</label>
          <Input
            value={form.targetUsers}
            onChange={set("targetUsers")}
            placeholder="e.g. First-time hackathon participants"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Technology / Skills</label>
          <Input
            value={form.techStack}
            onChange={set("techStack")}
            placeholder="React, FastAPI, PostgreSQL"
          />
          <span className="text-xs text-neutral-400 mt-1 block">Comma-separated — used to suggest a tech stack</span>
        </div>

        <Button type="submit" variant="ai" isLoading={loading} className="gap-2 self-start mt-2">
          <Sparkles className="h-4 w-4" />
          {loading ? "Analyzing your idea..." : "Validate Idea"}
        </Button>
      </form>
    </div>
  );
}

export default ValidatorInput;
