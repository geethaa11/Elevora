import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import Badge from "./Badge.jsx";
import Button from "./Button.jsx";

export default function StudentCard({ student, onConnect }) {
  return (
    <article className="flex flex-col gap-3 rounded-card border border-neutral-700 bg-neutral-800 p-4 shadow-card transition-colors hover:border-gold/40">
      <div className="flex items-start gap-3">
        <Avatar name={student.name} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-h4 text-neutral-0">{student.name}</h3>
          <p className="text-small text-neutral-500">{student.role}</p>
        </div>
        <span className="shrink-0 rounded-full bg-success/15 px-2.5 py-1 text-caption font-semibold text-success">
          {student.compatibility}% match
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {student.skills.map((s) => (
          <Badge key={s} tone="neutral">
            {s}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-x-3 text-caption text-neutral-500">
        <span>Available {student.availability}</span>
        <span className="h-1 w-1 rounded-full bg-neutral-700" />
        <span>{student.hackathonExperience} hackathons</span>
      </div>

      <div className="mt-1 flex gap-2">
        <Link to={`/team-builder/${student.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            View Profile
          </Button>
        </Link>
        <Button variant="primary" className="flex-1" onClick={() => onConnect(student)}>
          Connect
        </Button>
      </div>
    </article>
  );
}
