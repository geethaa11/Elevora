import React from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, Trophy } from "lucide-react";
import { Badge } from "../../components/ui/Badge.jsx";

export function MentorMarketplace() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold text-neutral-50">Mentor Marketplace</h1>
        <p className="text-sm text-neutral-400">
          Get guidance from people who have already built, won, and judged hackathons.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          to="/mentors/free"
          className="flex flex-col gap-4 rounded-xl border border-neutral-700 bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-semantic-success/50 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <HeartHandshake className="h-9 w-9 text-semantic-success" strokeWidth={1.5} />
            <Badge variant="recommended">FREE VOLUNTEER</Badge>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-neutral-50">Free Volunteer Guidance</h2>
            <p className="mt-1.5 text-sm text-neutral-400">
              Get quick advice, technical unblocking, and general guidance from experienced volunteers.
            </p>
          </div>
          <span className="mt-auto text-sm font-semibold text-semantic-success">Find Volunteer Mentors →</span>
        </Link>

        <Link
          to="/mentors/paid"
          className="flex flex-col gap-4 rounded-xl border border-neutral-700 bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <Trophy className="h-9 w-9 text-primary" strokeWidth={1.5} />
            <Badge variant="featured">PAID EXPERT</Badge>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-neutral-50">Paid Expert Session</h2>
            <p className="mt-1.5 text-sm text-neutral-400">
              Book focused 1:1 sessions (30/60m) for code review, pitch coaching, and judge Q&A prep.
            </p>
          </div>
          <span className="mt-auto text-sm font-semibold text-primary">Find Expert Mentors →</span>
        </Link>
      </div>
    </div>
  );
}

export default MentorMarketplace;
