import React from "react";
import { useParams, Link } from "react-router-dom";
import { students } from "../../data/students.js";
import { Avatar } from "../../components/domain/Avatar.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { ProgressBar } from "../../components/domain/ScoreCard.jsx";
import { useAppState } from "../../context/AppStateContext.jsx";

export function TeammateProfile() {
  const { id } = useParams();
  const { addTeamMember } = useAppState();
  const student = students.find((s) => s.id === id);

  if (!student) {
    return <div className="mx-auto max-w-3xl px-6 py-16 text-center text-neutral-400">Profile not found.</div>;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 py-4">
      <div className="flex items-start gap-4">
        <Avatar name={student.name} size={64} />
        <div>
          <h1 className="font-display text-3xl font-bold text-neutral-50">{student.name}</h1>
          <p className="text-sm text-neutral-400">
            {student.role} · {student.college}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-700 bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-lg font-bold text-neutral-50">{student.compatibility}% Compatibility</p>
        </div>
        <ProgressBar value={student.compatibility} max={100} tone="success" />
        <p className="mb-2 mt-4 text-sm font-medium text-neutral-200">Why this match?</p>
        <ul className="list-disc space-y-1 pl-5 text-xs text-neutral-400">
          <li>Complementary technical skills</li>
          <li>Similar hackathon interests</li>
          <li>Matching project domain</li>
          <li>Compatible availability</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Availability", student.availability],
          ["Projects", student.projects],
          ["Hackathons", student.hackathonExperience],
          ["GitHub", student.github],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-neutral-400">{label}</p>
            <p className="truncate text-sm font-semibold text-neutral-50">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-neutral-200">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {student.skills.map((s) => (
            <Badge key={s} variant="default">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-neutral-200">About</p>
        <p className="text-sm text-neutral-300 leading-relaxed">{student.about}</p>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-neutral-700 pt-6">
        <Button variant="secondary">Message</Button>
        <Button variant="primary" onClick={() => addTeamMember(student)}>
          Add to Team
        </Button>
        <Link to="/team-builder/create" className="ml-auto">
          <Button variant="ghost">Go to team →</Button>
        </Link>
      </div>
    </div>
  );
}

export default TeammateProfile;
