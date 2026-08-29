import { useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Upload } from "lucide-react";
import { paidMentors } from "../../data/mentors.js";
import { hackathons } from "../../data/hackathons.js";
import { Input, Textarea, FieldSelect, RadioCard } from "../../components/Fields.jsx";
import Button from "../../components/Button.jsx";
import { bookPaidSession } from "../../services/mockServices.js";

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
  "Your details",
  "Session focus",
  "What should the mentor review?",
  "Project links",
  "Questions for the mentor",
  "Session duration",
  "Select session slot",
];

export default function PaidBooking() {
  const { id } = useParams();
  const mentor = paidMentors.find((m) => m.id === id);
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    hackathon: "",
    projectName: "",
    stage: "",
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
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" />
        <h1 className="font-display text-h1 text-neutral-0">Session Confirmed</h1>
        <p className="text-body text-neutral-500">
          Your expert session with {mentor.name} is booked for {form.date} at {form.time}.
        </p>
        <Button variant="primary">View Session</Button>
      </div>
    );
  }

  // Summary step (index === STEP_TITLES.length)
  if (step === STEP_TITLES.length) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-8 px-6 py-10 lg:px-10">
        <header>
          <h1 className="font-display text-h1 text-neutral-0">Session Summary</h1>
        </header>

        <div className="flex flex-col gap-3 rounded-card border border-neutral-700 bg-neutral-800 p-5">
          {[
            ["Mentor", mentor.name],
            ["Focus", form.focus.join(" + ") || "—"],
            ["Duration", `${form.duration.minutes} minutes`],
            ["Date", form.date],
            ["Time", form.time || "—"],
            ["Amount", `₹${form.duration.price}`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-neutral-700 pb-2 last:border-0 last:pb-0">
              <span className="text-small text-neutral-500">{label}</span>
              <span className="text-small font-semibold text-neutral-0">{value}</span>
            </div>
          ))}
        </div>

        <p className="rounded-control border border-warning/30 bg-warning/10 px-4 py-3 text-small text-warning">
          Prototype booking — payment integration coming later.
        </p>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={back}>
            Back
          </Button>
          <Button variant="primary" loading={loading} onClick={handleConfirm}>
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
    <div className="mx-auto flex max-w-xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header className="flex flex-col gap-1">
        <p className="text-small text-neutral-500">
          Booking {mentor.name} · Step {step + 1} of {STEP_TITLES.length}
        </p>
        <h1 className="font-display text-h2 text-neutral-0">{STEP_TITLES[step]}</h1>
      </header>

      {step === 0 && (
        <div className="flex flex-col gap-5">
          <Input label="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FieldSelect
            label="Hackathon"
            value={form.hackathon}
            onChange={(v) => setForm({ ...form, hackathon: v })}
            options={hackathons.map((h) => h.name)}
          />
          <Input
            label="Project Name"
            value={form.projectName}
            onChange={(e) => setForm({ ...form, projectName: e.target.value })}
          />
          <FieldSelect
            label="Project Stage"
            value={form.stage}
            onChange={(v) => setForm({ ...form, stage: v })}
            options={PROJECT_STAGES}
          />
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-2">
          {FOCUS_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-3 rounded-control border border-neutral-700 bg-neutral-800 px-4 py-3"
            >
              <input
                type="checkbox"
                checked={form.focus.includes(opt)}
                onChange={() => toggleFocus(opt)}
                className="h-4 w-4 accent-gold"
              />
              <span className="text-small text-neutral-200">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {step === 2 && (
        <Textarea
          placeholder="What would you like the mentor to review?"
          rows={6}
          value={form.reviewNotes}
          onChange={(e) => setForm({ ...form, reviewNotes: e.target.value })}
        />
      )}

      {step === 3 && (
        <div className="flex flex-col gap-5">
          <Input
            label="GitHub URL"
            helper="Optional"
            value={form.github}
            onChange={(e) => setForm({ ...form, github: e.target.value })}
            placeholder="https://github.com/..."
          />
          <Input
            label="Live Demo URL"
            helper="Optional"
            value={form.demoUrl}
            onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
            placeholder="https://..."
          />
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-control border border-dashed border-neutral-700 py-6 text-small text-neutral-500 hover:border-gold/50 hover:text-gold"
          >
            <Upload className="h-4 w-4" />
            Upload project document (optional)
          </button>
        </div>
      )}

      {step === 4 && (
        <Textarea
          label="Questions for the Mentor"
          helper="What should the mentor focus on during the session?"
          rows={6}
          value={form.questions}
          onChange={(e) => setForm({ ...form, questions: e.target.value })}
        />
      )}

      {step === 5 && (
        <div className="flex flex-col gap-2">
          {mentor.sessionDurations.map((d) => (
            <RadioCard
              key={d.minutes}
              label={`${d.minutes} minutes`}
              sub={`₹${d.price}`}
              selected={form.duration?.minutes === d.minutes}
              onSelect={() => setForm({ ...form, duration: d })}
            />
          ))}
        </div>
      )}

      {step === 6 && (
        <div className="flex flex-col gap-5">
          <FieldSelect label="Select Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} options={DATE_OPTIONS} />
          <div>
            <p className="mb-2 text-small font-medium text-neutral-200">Available Times</p>
            <div className="grid grid-cols-2 gap-2">
              {TIME_OPTIONS.map((t) => (
                <RadioCard key={t} label={t} selected={form.time === t} onSelect={() => setForm({ ...form, time: t })} />
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
