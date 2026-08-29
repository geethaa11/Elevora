import { Link } from "react-router-dom";
import { Compass, Users, Sparkles, Mic2, HeartHandshake } from "lucide-react";

const TILES = [
  { to: "/hackathons", label: "Hackathon Explorer", desc: "Explore ongoing opportunities.", icon: Compass },
  { to: "/team-builder", label: "Student Teaming", desc: "Find compatible teammates.", icon: Users },
  { to: "/validator", label: "AI Validator", desc: "Get AI feedback on your idea.", icon: Sparkles },
  { to: "/demo-coach", label: "AI Demo Coach", desc: "Improve your presentation.", icon: Mic2 },
  { to: "/mentors", label: "Mentor Marketplace", desc: "Book sessions with mentors.", icon: HeartHandshake },
];

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header>
        <h1 className="font-display text-h1 text-neutral-0">Hey there 👋</h1>
        <p className="text-body text-neutral-500">Ready to build something awesome?</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TILES.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col gap-3 rounded-card border border-neutral-700 bg-neutral-800 p-5 transition-colors hover:border-gold/40"
          >
            <Icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
            <div>
              <p className="font-display text-h4 text-neutral-0">{label}</p>
              <p className="text-small text-neutral-500">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
