import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Upload } from "lucide-react";
import { paidMentors } from "../../data/mentors.js";
import { hackathons } from "../../data/hackathons.js";
import { Input } from "../../components/ui/Input.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { bookPaidSession } from "../../services/mentorService.js";

const PROJECT_STAGES = ["Idea", "Prototype", "MVP", "Final Demo"];
const FOCUS_OPTIONS = [
  "Idea Validation",
  "Technical Architecture",
  "Product Strategy",
  "UI/UX",
  "Team Management",
  "Pitch Preparation",
  "Demo Preparation",
  "Judge Q&A",
];
const DATE_OPTIONS = ["29 Aug", "30 Aug", "31 Aug"];
const TIME_OPTIONS = ["10:00 AM", "11:30 AM", "02:00 PM", "06:30 PM"];

const STEP_TITLES = [
  "Your Details",
  "Session Focus",
  "What should the mentor review?",
  "Project Links",
  "Questions for Mentor",
  "Session Duration",
  "Select Time Slot",
];

export function PaidBooking() {
  const { id } = useParams();
  const mentor = paidMentors.find((m) => m.id === id);
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    hackathon: "",
    projectName: "",
    stage: PROJECT_STAGES[0],
    focus: [],
    reviewNotes: "",
    github: "",
    demoUrl: "",
    questions: "",
    duration: mentor?.sessionDurations[0] || null,
    date: DATE_OPTIONS[0],
    time: "",
  });

  if (!mentor) return null;

  const toggleFocus = (opt) => {
    setForm((f) => ({
      ...f,
      focus: f.focus.includes(opt) ? f.focus.filter((o) => o !== opt) : [...f.focus, opt],
    }));
  };

  const next = () => setStep((s) => Math.min(s + 1, STEP_TITLES.length));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleConfirm = async () => {
    setLoading(true);
    await bookPaidSession(id, form);
    setLoading(false);
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-20 text-center">
        <CheckCircle2 className="h-14 w-14 text-semantic-success" />
        <h1 className="font-display text-3xl font-bold text-neutral-50">Session Confirmed!</h1>
        <p className="text-sm text-neutral-400">
          Your expert 1:1 session with {mentor.name} is booked for {form.date} at {form.time || "scheduled time"}.
        </p>
        <p className="text-xs text-neutral-400">Calendar invite and meeting link have been prepared for your dashboard.</p>
        <Button variant="primary" className="mt-2">View My Sessions</Button>
      </div>
    );
  }

  if (step === STEP_TITLES.length) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-8 py-4">
        <header>
          <h1 className="font-display text-3xl font-bold text-neutral-50">Session Summary</h1>
        </header>

        <div className="flex flex-col gap-3 rounded-xl border border-neutral-700 bg-surface p-5">
          {[
            ["Mentor", mentor.name],
            ["Focus", form.focus.join(", ") || "—"],
            ["Duration", form.duration ? `${form.duration.minutes} minutes` : "30 minutes"],
            ["Date", form.date],
            ["Time", form.time || "—"],
            ["Amount", form.duration ? `₹${form.duration.price}` : "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-neutral-700/60 pb-2 last:border-0 last:pb-0">
              <span className="text-sm text-neutral-400">{label}</span>
              <span className="text-sm font-semibold text-neutral-50">{value}</span>
            </div>
          ))}
        </div>

        <p className="rounded-xl border border-semantic-warning/30 bg-semantic-warning/10 px-4 py-3 text-xs text-semantic-warning">
          Prototype Booking — Simulated expert reservation (no actual payment charged).
        </p>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={back}>
            Back
          </Button>
          <Button variant="primary" isLoading={loading} onClick={handleConfirm}>
            Confirm Session
          </Button>
        </div>
      </div>
    );
  }

  const canContinue = () => {
    if (step === 5) return !!form.duration;
    if (step === 6) return !!form.time;
    return true;
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <p className="text-xs text-neutral-400">
          Booking {mentor.name} · Step {step + 1} of {STEP_TITLES.length}
        </p>
        <h1 className="font-display text-2xl font-bold text-neutral-50">{STEP_TITLES[step]}</h1>
      </header>

      {step === 0 && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-1.5">Your Name *</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-1.5">Hackathon</label>
            <Select value={form.hackathon} onChange={(e) => setForm({ ...form, hackathon: e.target.value })}>
              <option value="">Select hackathon</option>
              {hackathons.map((h) => (
                <option key={h.id} value={h.name}>{h.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-1.5">Project Name</label>
            <Input value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} placeholder="Project title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-1.5">Project Stage</label>
            <Select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
              {PROJECT_STAGES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid grid-cols-1 gap-2.5">
          {FOCUS_OPTIONS.map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                form.focus.includes(opt) ? "border-primary bg-primary/10" : "border-neutral-700 bg-surface hover:border-neutral-600"
              }`}
            >
              <input
                type="checkbox"
                checked={form.focus.includes(opt)}
                onChange={() => toggleFocus(opt)}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm font-medium text-neutral-200">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Review Notes</label>
          <Textarea
            placeholder="What would you like the mentor to review?"
            rows={6}
            value={form.reviewNotes}
            onChange={(e) => setForm({ ...form, reviewNotes: e.target.value })}
          />
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-1.5">GitHub URL (Optional)</label>
            <Input
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-1.5">Live Demo URL (Optional)</label>
            <Input
              value={form.demoUrl}
              onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-700 py-6 text-sm text-neutral-400 hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload project document (optional)
          </button>
        </div>
      )}

      {step === 4 && (
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-1.5">Questions for Mentor</label>
          <Textarea
            placeholder="What key questions should the mentor focus on during the session?"
            rows={6}
            value={form.questions}
            onChange={(e) => setForm({ ...form, questions: e.target.value })}
          />
        </div>
      )}

      {step === 5 && (
        <div className="flex flex-col gap-3">
          {mentor.sessionDurations.map((d) => (
            <button
              key={d.minutes}
              type="button"
              onClick={() => setForm({ ...form, duration: d })}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                form.duration?.minutes === d.minutes ? "border-primary bg-primary/10" : "border-neutral-700 bg-surface hover:border-neutral-600"
              }`}
            >
              <div>
                <p className="text-base font-semibold text-neutral-50">{d.minutes} minutes</p>
                <p className="text-xs text-neutral-400">Focused 1:1 mentorship session</p>
              </div>
              <span className="text-lg font-bold text-primary">₹{d.price}</span>
            </button>
          ))}
        </div>
      )}

      {step === 6 && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-1.5">Select Date</label>
            <Select value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}>
              {DATE_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-200">Available Time Slots</p>
            <div className="grid grid-cols-2 gap-2">
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, time: t })}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    form.time === t ? "border-primary bg-primary/10 text-primary" : "border-neutral-700 bg-surface text-neutral-200 hover:border-neutral-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="ghost" onClick={back}>
            Back
          </Button>
        )}
        <Button variant="primary" onClick={next} disabled={!canContinue()}>
          {step === STEP_TITLES.length - 1 ? "Review Summary" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

export default PaidBooking;
