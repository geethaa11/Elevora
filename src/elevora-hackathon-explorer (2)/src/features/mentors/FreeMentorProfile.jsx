import { useParams, Link } from "react-router-dom";
import { freeMentors } from "../../data/mentors.js";
import Avatar from "../../components/Avatar.jsx";
import Badge from "../../components/Badge.jsx";
import Button from "../../components/Button.jsx";

export default function FreeMentorProfile() {
  const { id } = useParams();
  const mentor = freeMentors.find((m) => m.id === id);

  if (!mentor) return <div className="mx-auto max-w-3xl px-6 py-16 text-center text-neutral-500">Mentor not found.</div>;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-10 lg:px-10">
      <div className="flex items-start gap-4">
        <Avatar name={mentor.name} size={64} />
        <div>
          <h1 className="font-display text-h1 text-neutral-0">{mentor.name}</h1>
          <p className="text-body text-neutral-500">{mentor.expertise}</p>
        </div>
        <Badge tone="free">FREE</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["College / Org", mentor.college],
          ["Experience", mentor.experience],
          ["Hackathon experience", mentor.hackathons],
          ["Availability", mentor.availability],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-caption text-neutral-500">{label}</p>
            <p className="text-small font-semibold text-neutral-0">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 text-small font-medium text-neutral-200">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {mentor.skills.map((s) => (
            <Badge key={s} tone="neutral">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-small font-medium text-neutral-200">About</p>
        <p className="text-body text-neutral-200">{mentor.bio}</p>
      </div>

      <div>
        <p className="mb-2 text-small font-medium text-neutral-200">Languages</p>
        <p className="text-small text-neutral-200">{mentor.languages.join(", ")}</p>
      </div>

      <div className="border-t border-neutral-700 pt-6">
        <Link to={`/mentors/free/${mentor.id}/request`}>
          <Button variant="primary">Ask for Help</Button>
        </Link>
      </div>
    </div>
  );
}
