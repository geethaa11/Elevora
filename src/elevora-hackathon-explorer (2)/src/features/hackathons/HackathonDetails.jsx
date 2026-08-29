import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { hackathons } from "../../data/hackathons.js";
import { Tabs } from "../../components/Fields.jsx";
import Button from "../../components/Button.jsx";
import Badge from "../../components/Badge.jsx";
import { formatDeadline } from "../../utils/dateUtils.js";
import { useAppState } from "../../context/AppState.jsx";

const TIMELINE = [
  "Registration Opens",
  "Registration Closes",
  "Shortlisting",
  "Hackathon Starts",
  "Submission Deadline",
  "Final Demo",
];

export default function HackathonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedHackathon } = useAppState();
  const [tab, setTab] = useState("About");
  const hackathon = hackathons.find((h) => h.id === id);

  if (!hackathon) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-neutral-500">
        Hackathon not found.
      </div>
    );
  }

  const handleBuildProject = () => {
    setSelectedHackathon(hackathon);
    navigate("/team-builder");
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10 lg:px-10">
      <div>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {hackathon.featured && <Badge>Featured</Badge>}
          {hackathon.beginnerFriendly && <Badge>Beginner Friendly</Badge>}
        </div>
        <h1 className="font-display text-h1 text-neutral-0">{hackathon.name}</h1>
        <p className="mt-1 text-body text-neutral-500">{hackathon.organizer}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-card border border-neutral-700 bg-neutral-800 p-4 sm:grid-cols-4">
        {[
          ["Domain", hackathon.domain],
          ["Mode", hackathon.mode],
          ["Prize", hackathon.prize],
          ["Team size", hackathon.teamSize],
          ["Difficulty", hackathon.difficulty],
          ["Registration closes", formatDeadline(hackathon.registrationDeadline)],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-caption text-neutral-500">{label}</p>
            <p className="text-small font-semibold text-neutral-0">{value}</p>
          </div>
        ))}
      </div>

      <Tabs tabs={["About", "Problem Statements", "Rules", "Timeline", "FAQs"]} active={tab} onChange={setTab} />

      <div className="text-body text-neutral-200">
        {tab === "About" && <p>{hackathon.description}</p>}
        {tab === "Problem Statements" && (
          <p className="text-neutral-500">
            Problem statements are released to registered teams closer to the event start date.
          </p>
        )}
        {tab === "Rules" && (
          <ul className="list-disc space-y-1.5 pl-5 text-neutral-200">
            <li>All code must be written during the hackathon window.</li>
            <li>Teams must stay within the stated team size.</li>
            <li>Use of AI coding assistants is allowed unless stated otherwise.</li>
          </ul>
        )}
        {tab === "Timeline" && (
          <ol className="flex flex-col gap-3">
            {TIMELINE.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-caption font-semibold text-gold">
                  {i + 1}
                </span>
                <span className="text-small text-neutral-200">{step}</span>
              </li>
            ))}
          </ol>
        )}
        {tab === "FAQs" && (
          <p className="text-neutral-500">Reach out to the organizer for event-specific questions.</p>
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
