import { Link } from "react-router-dom";
import { Star, Trophy } from "lucide-react";
import Avatar from "./Avatar.jsx";
import Badge from "./Badge.jsx";
import Button from "./Button.jsx";

export default function MentorCard({ mentor, kind }) {
  const isPaid = kind === "paid";
  const basePath = isPaid ? "/mentors/paid" : "/mentors/free";

  return (
    <article className="flex flex-col gap-3 rounded-card border border-neutral-700 bg-neutral-800 p-4 shadow-card transition-colors hover:border-gold/40">
      <div className="flex items-start gap-3">
        <Avatar name={mentor.name} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-h4 text-neutral-0">{mentor.name}</h3>
          <p className="text-small text-neutral-500">{mentor.expertise}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {mentor.skills.map((s) => (
          <Badge key={s} tone="neutral">
            {s}
          </Badge>
        ))}
      </div>

      {isPaid ? (
        <div className="flex items-center gap-x-3 text-caption text-neutral-500">
          <span className="flex items-center gap-1 text-neutral-200">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {mentor.rating} ({mentor.reviews})
          </span>
          <span className="h-1 w-1 rounded-full bg-neutral-700" />
          <span className="flex items-center gap-1">
            <Trophy className="h-3.5 w-3.5" />
            {mentor.hackathons} hackathons
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-x-3 text-caption text-neutral-500">
          <span>Hackathon experience: {mentor.hackathons}</span>
          <span className="h-1 w-1 rounded-full bg-neutral-700" />
          <span>Available: {mentor.availability}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Badge tone={isPaid ? "paid" : "free"}>{isPaid ? "Expert" : "Volunteer"}</Badge>
        {isPaid ? (
          <span className="text-small font-semibold text-gold">
            {mentor.sessionDurations[0].minutes} min • ₹{mentor.sessionDurations[0].price}
          </span>
        ) : (
          <span className="text-small font-semibold text-success">FREE</span>
        )}
      </div>

      <div className="mt-1 flex gap-2">
        <Link to={`${basePath}/${mentor.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            View Profile
          </Button>
        </Link>
        <Link
          to={isPaid ? `${basePath}/${mentor.id}/book` : `${basePath}/${mentor.id}/request`}
          className="flex-1"
        >
          <Button variant="primary" className="w-full">
            {isPaid ? "Book Session" : "Ask for Help"}
          </Button>
        </Link>
      </div>
    </article>
  );
}
