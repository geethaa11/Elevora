import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { freeMentors } from "../../data/mentors.js";
import { hackathons } from "../../data/hackathons.js";
import { Input } from "../../components/ui/Input.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { requestFreeGuidance } from "../../services/mentorService.js";

const HELP_TOPICS = ["Idea Validation", "Team Building", "Technical Problem", "UI/UX", "Pitch", "General Guidance"];
const RESPONSE_TIMES = ["Today", "Within 2 days", "This week"];

export function FreeGuidanceRequest() {
  const { id } = useParams();
  const mentor = freeMentors.find((m) => m.id === id);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    hackathon: "",
    topic: HELP_TOPICS[0],
    question: "",
    tried: "",
    responseTime: RESPONSE_TIMES[0],
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
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-20 text-center">
        <CheckCircle2 className="h-12 w-12 text-semantic-success" />
        <h1 className="font-display text-3xl font-bold text-neutral-50">Request Sent</h1>
        <p className="text-sm text-neutral-400">Your guidance request has been submitted to {mentor.name}.</p>
        <p className="text-xs text-neutral-400">No payment is required. You will receive advice as soon as the mentor is online.</p>
        <Link to="/mentors">
          <Button variant="secondary" className="mt-2">Back to Mentor Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 py-4">
      <header>
        <h1 className="font-display text-3xl font-bold text-neutral-50">Ask {mentor.name} for Help</h1>
        <p className="text-sm text-neutral-400 mt-1">Submit a free guidance request for quick advice.</p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Your Name *</label>
          <Input required value={form.name} onChange={set("name")} placeholder="Your full name" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Your Hackathon</label>
          <Select value={form.hackathon} onChange={set("hackathon")}>
            <option value="">Select hackathon (optional)</option>
            {hackathons.map((h) => (
              <option key={h.id} value={h.name}>{h.name}</option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">What do you need help with?</label>
          <Select value={form.topic} onChange={set("topic")}>
            {HELP_TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Describe your question *</label>
          <Textarea required rows={4} value={form.question} onChange={set("question")} placeholder="What specific issue are you facing?" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">What have you tried already?</label>
          <Textarea rows={3} value={form.tried} onChange={set("tried")} placeholder="Describe any solutions or steps you've attempted" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Preferred response time</label>
          <Select value={form.responseTime} onChange={set("responseTime")}>
            {RESPONSE_TIMES.map((rt) => (
              <option key={rt} value={rt}>{rt}</option>
            ))}
          </Select>
        </div>

        <Button type="submit" variant="primary" isLoading={loading} className="self-start mt-2">
          Send Guidance Request
        </Button>
      </form>
    </div>
  );
}

export default FreeGuidanceRequest;
