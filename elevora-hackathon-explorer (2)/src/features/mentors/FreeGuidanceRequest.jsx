import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { freeMentors } from "../../data/mentors.js";
import { hackathons } from "../../data/hackathons.js";
import { Input, Textarea, FieldSelect } from "../../components/Fields.jsx";
import Button from "../../components/Button.jsx";
import { requestFreeGuidance } from "../../services/mockServices.js";

const HELP_TOPICS = ["Idea Validation", "Team Building", "Technical Problem", "UI/UX", "Pitch", "General Guidance"];
const RESPONSE_TIMES = ["Today", "Within 2 days", "This week"];

export default function FreeGuidanceRequest() {
  const { id } = useParams();
  const mentor = freeMentors.find((m) => m.id === id);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    hackathon: "",
    topic: "",
    question: "",
    tried: "",
    responseTime: "Today",
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await requestFreeGuidance(id, form);
    setLoading(false);
    setSent(true);
  };

  if (!mentor) return null;

  if (sent) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" />
        <h1 className="font-display text-h1 text-neutral-0">Request Sent</h1>
        <p className="text-body text-neutral-500">Your guidance request has been sent to {mentor.name}.</p>
        <p className="text-small text-neutral-500">You will receive a response when the mentor is available.</p>
        <Link to="/mentors">
          <Button variant="secondary">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header>
        <h1 className="font-display text-h1 text-neutral-0">Ask {mentor.name} for help</h1>
        <p className="text-body text-neutral-500">A short guidance request — no payment involved.</p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input label="Your Name" required value={form.name} onChange={set("name")} />
        <FieldSelect
          label="Your Hackathon"
          value={form.hackathon}
          onChange={(v) => setForm({ ...form, hackathon: v })}
          options={hackathons.map((h) => h.name)}
        />
        <FieldSelect
          label="What do you need help with?"
          value={form.topic}
          onChange={(v) => setForm({ ...form, topic: v })}
          options={HELP_TOPICS}
        />
        <Textarea label="Describe your question" required value={form.question} onChange={set("question")} />
        <Textarea label="What have you tried already?" value={form.tried} onChange={set("tried")} />
        <FieldSelect
          label="Preferred response time"
          value={form.responseTime}
          onChange={(v) => setForm({ ...form, responseTime: v })}
          options={RESPONSE_TIMES}
        />

        <Button type="submit" variant="primary" loading={loading} className="justify-self-start">
          Send Request
        </Button>
      </form>
    </div>
  );
}

