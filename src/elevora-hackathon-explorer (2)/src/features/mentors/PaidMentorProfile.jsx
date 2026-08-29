import { useParams, Link } from "react-router-dom";
import { Star, Trophy } from "lucide-react";
import { paidMentors } from "../../data/mentors.js";
import Avatar from "../../components/Avatar.jsx";
import Badge from "../../components/Badge.jsx";
import Button from "../../components/Button.jsx";

export default function PaidMentorProfile() {
  const { id } = useParams();
  const mentor = paidMentors.find((m) => m.id === id);

  if (!mentor) return <div className="mx-auto max-w-3xl px-6 py-16 text-center text-neutral-500">Mentor not found.</div>;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-10 lg:px-10">
      <div className="flex items-start gap-4">
        <Avatar name={mentor.name} size={64} />
        <div>
          <h1 className="font-display text-h1 text-neutral-0">{mentor.name}</h1>
          <p className="text-body text-neutral-500">{mentor.expertise}</p>
          <div className="mt-1 flex items-center gap-1.5 text-small text-neutral-200">
            <Star className="h-4 w-4 fill-warning text-warning" />
            {mentor.rating} · {mentor.reviews} reviews
          </div>
        </div>
        <Badge tone="paid">Expert</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Experience", mentor.experience],
          ["Hackathon achievements", `${mentor.hackathons} wins / finalist`],
          ["Rating", `${mentor.rating} ⭐`],
          ["Availability", mentor.availability],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-caption text-neutral-500">{label}</p>
            <p className="text-small font-semibold text-neutral-0">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 text-small font-medium text-neutral-200">Expertise</p>
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
        <p className="mb-2 text-small font-medium text-neutral-200">Session types</p>
        <div className="flex flex-wrap gap-3">
          {mentor.sessionDurations.map((s) => (
            <span key={s.minutes} className="rounded-control border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-small text-neutral-200">
              <Trophy className="mr-1.5 inline h-3.5 w-3.5 text-gold" />
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
