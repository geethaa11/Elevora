import { useState } from "react";
import {
  Bookmark,
  Cpu,
  ShieldCheck,
  Sprout,
  Gamepad2,
  Landmark,
  HeartPulse,
  Cloud,
  Wrench,
  Palette,
  GraduationCap,
  Layers,
  Users,
  ArrowRight,
} from "lucide-react";
import Badge from "./Badge.jsx";
import { formatDeadline, formatDaysLeft, daysRemaining } from "../utils/dateUtils.js";

// A small, deliberately-illustrative thumbnail per domain rather than a
// stock photo — keeps every card on-brand and avoids an external image
// dependency for what is, right now, mock data.
const DOMAIN_ICON = {
  "AI/ML": Cpu,
  Cybersecurity: ShieldCheck,
  Sustainability: Sprout,
  "Game Dev": Gamepad2,
  GovTech: Landmark,
  "Civic Tech": Landmark,
  HealthTech: HeartPulse,
  "Cloud/DevOps": Cloud,
  Hardware: Wrench,
  "Design + Dev": Palette,
  EdTech: GraduationCap,
  FinTech: Layers,
  "Open Source": Layers,
  "Social Impact": Users,
  "Web Dev": Layers,
};

export default function HackathonCard({ hackathon, onExplore }) {
  const [saved, setSaved] = useState(false);
  const Icon = DOMAIN_ICON[hackathon.domain] || Layers;
  const days = daysRemaining(hackathon.registrationDeadline);
  const urgent = days <= 3;

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-neutral-700 bg-neutral-800 shadow-card transition-colors hover:border-gold/40">
      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-[#241a06]">
        <Icon className="h-9 w-9 text-gold/70" strokeWidth={1.5} />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {hackathon.featured && <Badge>Featured</Badge>}
          {hackathon.popular && <Badge>Popular</Badge>}
          {hackathon.beginnerFriendly && <Badge>Beginner Friendly</Badge>}
        </div>
        <button
          onClick={() => setSaved((s) => !s)}
          aria-label={saved ? "Remove from saved" : "Save hackathon"}
          aria-pressed={saved}
          className="absolute right-3 top-3 rounded-full bg-neutral-900/70 p-1.5 text-neutral-200 backdrop-blur transition-colors hover:text-gold"
        >
          <Bookmark className="h-4 w-4" fill={saved ? "#B8860B" : "none"} stroke={saved ? "#B8860B" : "currentColor"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-h4 leading-snug text-neutral-0">{hackathon.name}</h3>
          <p className="mt-0.5 text-caption text-neutral-500">{hackathon.organizer}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-neutral-500">
          <span>{hackathon.domain}</span>
          <span className="h-1 w-1 rounded-full bg-neutral-700" />
          <span>{hackathon.mode}</span>
          <span className="h-1 w-1 rounded-full bg-neutral-700" />
          <span>Team of {hackathon.teamSize}</span>
        </div>

        <div className="flex items-center justify-between rounded-control bg-neutral-900/60 px-3 py-2">
          <div>
            <p className="text-caption text-neutral-500">Prize</p>
            <p className="text-small font-semibold text-gold">{hackathon.prize}</p>
          </div>
          <div className="text-right">
            <p className="text-caption text-neutral-500">Registration closes</p>
            <p className="text-small font-semibold text-neutral-200">
              {formatDeadline(hackathon.registrationDeadline)}
            </p>
          </div>
        </div>

        <p className={`text-small font-semibold ${urgent ? "text-warning" : "text-neutral-500"}`}>
          {formatDaysLeft(hackathon.registrationDeadline)}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} tone="neutral">
              {tag}
            </Badge>
          ))}
          <Badge tone="neutral">{hackathon.difficulty}</Badge>
        </div>

        <button
          onClick={() => onExplore(hackathon)}
          className="mt-auto flex items-center justify-center gap-1.5 rounded-control bg-gold py-2.5 text-small font-semibold text-neutral-900 transition-colors hover:bg-[#a37a09]"
        >
          Explore
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
