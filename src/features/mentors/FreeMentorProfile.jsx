import React from "react";
import { useParams, Link } from "react-router-dom";
import { freeMentors } from "../../data/mentors.js";
import { Avatar } from "../../components/domain/Avatar.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";

export function FreeMentorProfile() {
  const { id } = useParams();
  const mentor = freeMentors.find((m) => m.id === id);

  if (!mentor) return <div className="mx-auto max-w-3xl px-6 py-16 text-center text-neutral-400">Mentor not found.</div>;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-4">
      <div className="flex items-start gap-4">
        <Avatar name={mentor.name} size={64} />
        <div>
          <h1 className="font-display text-3xl font-bold text-neutral-50">{mentor.name}</h1>
          <p className="text-sm text-neutral-400">{mentor.expertise}</p>
        </div>
        <Badge variant="recommended">FREE VOLUNTEER</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["College / Org", mentor.college],
          ["Experience", mentor.experience],
          ["Hackathons", mentor.hackathons],
          ["Availability", mentor.availability],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-neutral-400">{label}</p>
            <p className="text-sm font-semibold text-neutral-50">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-neutral-200">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {mentor.skills.map((s) => (
            <Badge key={s} variant="default">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-neutral-200">About</p>
        <p className="text-sm text-neutral-300 leading-relaxed">{mentor.bio}</p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-neutral-200">Languages</p>
        <p className="text-sm text-neutral-300">{mentor.languages.join(", ")}</p>
      </div>

      <div className="border-t border-neutral-700 pt-6">
        <Link to={`/mentors/free/${mentor.id}/request`}>
          <Button variant="primary">Ask for Help</Button>
        </Link>
      </div>
    </div>
  );
}

export default FreeMentorProfile;
