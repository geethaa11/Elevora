import { Link } from "react-router-dom";
import { HeartHandshake, Trophy } from "lucide-react";
import Badge from "../../components/Badge.jsx";

export default function MentorMarketplace() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-h1 text-neutral-0">Mentor Marketplace</h1>
        <p className="text-body text-neutral-500">
          Get guidance from people who have already built, won and learned from hackathons.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Link
          to="/mentors/free"
          className="flex flex-col gap-4 rounded-card border border-neutral-700 bg-neutral-800 p-6 transition-colors hover:border-success/50"
        >
          <div className="flex items-center justify-between">
            <HeartHandshake className="h-8 w-8 text-success" strokeWidth={1.5} />
            <Badge tone="free">FREE</Badge>
          </div>
          <div>
            <h2 className="font-display text-h3 text-neutral-0">Free Volunteer Guidance</h2>
            <p className="mt-1.5 text-body text-neutral-500">
              Get quick advice and guidance from experienced volunteers.
            </p>
          </div>
          <span className="mt-auto text-small font-semibold text-success">Find Volunteers →</span>
        </Link>

        <Link
          to="/mentors/paid"
          className="flex flex-col gap-4 rounded-card border border-neutral-700 bg-neutral-800 p-6 transition-colors hover:border-gold/50"
        >
          <div className="flex items-center justify-between">
            <Trophy className="h-8 w-8 text-gold" strokeWidth={1.5} />
            <Badge tone="paid">PAID</Badge>
          </div>
          <div>
            <h2 className="font-display text-h3 text-neutral-0">Paid Expert Session</h2>
            <p className="mt-1.5 text-body text-neutral-500">
              Get focused 1:1 guidance from experienced experts.
            </p>
          </div>
          <span className="mt-auto text-small font-semibold text-gold">Find Experts →</span>
        </Link>
      </div>
    </div>
  );
}
