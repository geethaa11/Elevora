import React from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Trophy } from "lucide-react";
import { paidMentors } from "../../data/mentors.js";
import { Avatar } from "../../components/domain/Avatar.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";

export function PaidMentorProfile() {
  const { id } = useParams();
  const mentor = paidMentors.find((m) => m.id === id);

  if (!mentor) return <div className="mx-auto max-w-3xl px-6 py-16 text-center text-neutral-400">Mentor not found.</div>;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-4">
      <div className="flex items-start gap-4">
        <Avatar name={mentor.name} size={64} />
        <div>
          <h1 className="font-display text-3xl font-bold text-neutral-50">{mentor.name}</h1>
          <p className="text-sm text-neutral-400">{mentor.expertise}</p>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-neutral-200">
            <Star className="h-4 w-4 fill-semantic-warning text-semantic-warning" />
            {mentor.rating} · {mentor.reviews} reviews
          </div>
        </div>
        <Badge variant="featured">EXPERT</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Experience", mentor.experience],
          ["Achievements", `${mentor.hackathons} wins / finalist`],
          ["Rating", `${mentor.rating} ⭐`],
          ["Availability", mentor.availability],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-neutral-400">{label}</p>
            <p className="text-sm font-semibold text-neutral-50">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-neutral-200">Expertise</p>
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
        <p className="mb-2 text-sm font-medium text-neutral-200">Session Types</p>
        <div className="flex flex-wrap gap-3">
          {mentor.sessionDurations.map((s) => (
            <span key={s.minutes} className="rounded-lg border border-neutral-700 bg-surface px-3 py-2 text-sm text-neutral-200">
              <Trophy className="mr-1.5 inline h-3.5 w-3.5 text-primary" />
              {s.minutes} min · ₹{s.price}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-700 pt-6">
        <Link to={`/mentors/paid/${mentor.id}/book`}>
          <Button variant="primary">Book Session</Button>
        </Link>
      </div>
    </div>
  );
}

export default PaidMentorProfile;
