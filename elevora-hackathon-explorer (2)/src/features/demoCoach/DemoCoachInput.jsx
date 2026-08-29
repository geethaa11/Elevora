import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Input, Textarea } from "../../components/Fields.jsx";
import Button from "../../components/Button.jsx";
import { useAppState } from "../../context/AppState.jsx";
import { submitPitchForCoaching } from "../../services/mockServices.js";

export default function DemoCoachInput() {
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
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header>
        <h1 className="font-display text-h1 text-neutral-0">AI Demo Coach</h1>
        <p className="text-body text-neutral-500">
          Get feedback on your pitch, gain clarity and improve your presentation.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input label="Project Name" required value={form.projectName} onChange={set("projectName")} />
        <Textarea label="Problem" required value={form.problem} onChange={set("problem")} />
        <Textarea label="Solution" required value={form.solution} onChange={set("solution")} />
        <Textarea
          label="Your Pitch"
          required
          rows={6}
          value={form.pitch}
          onChange={set("pitch")}
          placeholder="Paste your 60-second pitch here"
        />
        <Input label="Technology Stack" value={form.techStack} onChange={set("techStack")} placeholder="React, FastAPI" />
        <Input
          label="GitHub / Demo Link"
          helper="Optional"
          value={form.link}
          onChange={set("link")}
          placeholder="https://github.com/..."
        />

        <Button type="submit" variant="ai" loading={loading} className="justify-self-start">
          <Sparkles className="h-4 w-4" />
          {loading ? "Analyzing your pitch..." : "Start Coaching"}
        </Button>
      </form>
    </div>
  );
}
