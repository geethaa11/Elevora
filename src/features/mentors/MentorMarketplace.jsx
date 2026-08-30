import React from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, Trophy } from "lucide-react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Shared3CardCarousel } from "../../components/ui/Shared3CardCarousel.jsx";
import { MentorCard } from "../../components/domain/MentorCard.jsx";
import { freeMentors, paidMentors } from "../../data/mentors.js";

export function MentorMarketplace() {
  const featuredMentors = [
    { ...freeMentors[0], kind: "free" },
    { ...paidMentors[0], kind: "paid" },
    { ...freeMentors[1], kind: "free" },
    { ...paidMentors[1], kind: "paid" },
    { ...freeMentors[2], kind: "free" },
    { ...paidMentors[2], kind: "paid" },
  ];

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

      <div className="flex flex-col gap-4 pt-4 border-t border-neutral-800">
        <Shared3CardCarousel
          title="Featured Mentor Recommendations"
          items={featuredMentors}
          renderCard={(m) => <MentorCard mentor={m} kind={m.kind} />}
        />
      </div>
    </div>
  );
}

export default MentorMarketplace;

