import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hackathons } from "../../data/hackathons.js";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { formatDeadline } from "../../utils/dateUtils.js";
import { useAppState } from "../../context/AppStateContext.jsx";

const TIMELINE = [
  "Registration Opens",
  "Registration Closes",
  "Shortlisting",
  "Hackathon Starts",
  "Submission Deadline",
  "Final Demo",
];

export function HackathonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedHackathon } = useAppState();
  const [tab, setTab] = useState("About");
  const hackathon = hackathons.find((h) => h.id === id);

  if (!hackathon) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-neutral-400">
        Hackathon not found.
      </div>
    );
  }

  const handleBuildProject = () => {
    setSelectedHackathon(hackathon);
    navigate("/team-builder");
  };

  const tabs = ["About", "Problem Statements", "Rules", "Timeline", "FAQs"];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 py-4">
      <div>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {hackathon.featured && <Badge variant="featured">Featured</Badge>}
          {hackathon.beginnerFriendly && <Badge variant="recommended">Beginner Friendly</Badge>}
        </div>
        <h1 className="font-display text-3xl font-bold text-neutral-50">{hackathon.name}</h1>
        <p className="mt-1 text-sm text-neutral-400">{hackathon.organizer}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-700 bg-surface p-4 sm:grid-cols-4">
        {[
          ["Domain", hackathon.domain],
          ["Mode", hackathon.mode],
          ["Prize", hackathon.prize],
          ["Team size", hackathon.teamSize],
          ["Difficulty", hackathon.difficulty],
          ["Registration closes", formatDeadline(hackathon.registrationDeadline)],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-neutral-400">{label}</p>
            <p className="text-sm font-semibold text-neutral-50">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 border-b border-neutral-700 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              tab === t
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="text-sm text-neutral-200 min-h-[120px]">
        {tab === "About" && <p className="leading-relaxed">{hackathon.description}</p>}
        {tab === "Problem Statements" && (
          <p className="text-neutral-400">
            Problem statements are released to registered teams closer to the event start date.
          </p>
        )}
        {tab === "Rules" && (
          <ul className="list-disc space-y-2 pl-5 text-neutral-200">
            <li>All code must be written during the hackathon window.</li>
            <li>Teams must stay within the stated team size limit.</li>
            <li>Use of AI coding assistants is allowed unless stated otherwise.</li>
          </ul>
        )}
        {tab === "Timeline" && (
          <ol className="flex flex-col gap-3">
            {TIMELINE.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm text-neutral-200">{step}</span>
              </li>
            ))}
          </ol>
        )}
        {tab === "FAQs" && (
          <p className="text-neutral-400">Reach out to the organizer for event-specific questions.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-neutral-700 pt-6">
        <Button variant="primary" onClick={handleBuildProject}>
          Build Project
        </Button>
        <Button variant="secondary">Save</Button>
        <Button variant="ghost">Share</Button>
      </div>
    </div>
  );
}

export default HackathonDetails;
