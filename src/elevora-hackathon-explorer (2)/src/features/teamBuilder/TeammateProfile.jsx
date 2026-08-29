import { useParams, Link } from "react-router-dom";
import { students } from "../../data/students.js";
import Avatar from "../../components/Avatar.jsx";
import Badge from "../../components/Badge.jsx";
import Button from "../../components/Button.jsx";
import { ProgressBar } from "../../components/ScoreCard.jsx";
import { useAppState } from "../../context/AppState.jsx";

export default function TeammateProfile() {
  const { id } = useParams();
  const { addTeamMember } = useAppState();
  const student = students.find((s) => s.id === id);

  if (!student) {
    return <div className="mx-auto max-w-3xl px-6 py-16 text-center text-neutral-500">Profile not found.</div>;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10 lg:px-10">
      <div className="flex items-start gap-4">
        <Avatar name={student.name} size={64} />
        <div>
          <h1 className="font-display text-h1 text-neutral-0">{student.name}</h1>
          <p className="text-body text-neutral-500">
            {student.role} · {student.college}
          </p>
        </div>
      </div>

      <div className="rounded-card border border-neutral-700 bg-neutral-800 p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-h4 text-neutral-0">{student.compatibility}% Compatibility</p>
        </div>
        <ProgressBar value={student.compatibility} max={100} tone="success" />
        <p className="mb-2 mt-4 text-small font-medium text-neutral-200">Why this match?</p>
        <ul className="list-disc space-y-1 pl-5 text-small text-neutral-500">
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
            <p className="text-caption text-neutral-500">{label}</p>
            <p className="truncate text-small font-semibold text-neutral-0">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 text-small font-medium text-neutral-200">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {student.skills.map((s) => (
            <Badge key={s} tone="neutral">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-small font-medium text-neutral-200">About</p>
        <p className="text-body text-neutral-200">{student.about}</p>
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
