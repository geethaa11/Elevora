import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Input, Textarea } from "../../components/Fields.jsx";
import Button from "../../components/Button.jsx";
import { useAppState } from "../../context/AppState.jsx";
import { submitIdeaForValidation } from "../../services/mockServices.js";

export default function ValidatorInput() {
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
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header>
        <h1 className="font-display text-h1 text-neutral-0">Validate Your Idea</h1>
        <p className="text-body text-neutral-500">Tell us about your idea so Elevora can analyze it.</p>
        {selectedHackathon && (
          <p className="mt-2 text-small text-gold">
            For {selectedHackathon.name}
            {team.length > 0 && ` · Team of ${team.length + 1}`}
          </p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input label="Project Name" required value={form.projectName} onChange={set("projectName")} placeholder="e.g. Elevora" />
        <Textarea
          label="Problem Statement"
          required
          value={form.problem}
          onChange={set("problem")}
          placeholder="What problem are you solving, and for whom?"
        />
        <Textarea
          label="Proposed Solution"
          required
          value={form.solution}
          onChange={set("solution")}
          placeholder="How does your idea solve it?"
        />
        <Input
          label="Target Users"
          value={form.targetUsers}
          onChange={set("targetUsers")}
          placeholder="e.g. First-time hackathon participants"
        />
        <Input
          label="Technology / Skills"
          helper="Comma-separated — used to suggest a tech stack"
          value={form.techStack}
          onChange={set("techStack")}
          placeholder="React, FastAPI, PostgreSQL"
        />

        <Button type="submit" variant="ai" loading={loading} className="justify-self-start">
          <Sparkles className="h-4 w-4" />
          {loading ? "Analyzing your idea..." : "Validate Idea"}
        </Button>
      </form>
    </div>
  );
}
