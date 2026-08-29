import React, { useState } from "react";
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
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatDeadline, formatDaysLeft, daysRemaining } from "../../utils/dateUtils.js";

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

export function HackathonCard({ hackathon, onExplore }) {
  const [saved, setSaved] = useState(false);
  const Icon = DOMAIN_ICON[hackathon.domain] || Layers;
  const days = daysRemaining(hackathon.registrationDeadline);
  const urgent = days <= 3;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-neutral-700 bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-[#241a06]">
        <Icon className="h-9 w-9 text-primary/80" strokeWidth={1.5} />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {hackathon.featured && <Badge variant="featured">Featured</Badge>}
          {hackathon.popular && <Badge variant="popular">Popular</Badge>}
          {hackathon.beginnerFriendly && <Badge variant="recommended">Beginner Friendly</Badge>}
        </div>
        <button
          onClick={() => setSaved((s) => !s)}
          aria-label={saved ? "Remove from saved" : "Save hackathon"}
          aria-pressed={saved}
          className="absolute right-3 top-3 rounded-full bg-neutral-900/70 p-1.5 text-neutral-200 backdrop-blur transition-colors hover:text-primary"
        >
          <Bookmark className="h-4 w-4" fill={saved ? "#B8860B" : "none"} stroke={saved ? "#B8860B" : "currentColor"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-lg font-bold leading-snug text-neutral-50 group-hover:text-primary transition-colors">
            {hackathon.name}
          </h3>
          <p className="mt-0.5 text-xs text-neutral-400">{hackathon.organizer}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
          <span>{hackathon.domain}</span>
          <span className="h-1 w-1 rounded-full bg-neutral-700" />
          <span>{hackathon.mode}</span>
          <span className="h-1 w-1 rounded-full bg-neutral-700" />
          <span>Team of {hackathon.teamSize}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-neutral-900/60 px-3 py-2 border border-neutral-700/50">
          <div>
            <p className="text-xs text-neutral-400">Prize</p>
            <p className="text-sm font-semibold text-primary">{hackathon.prize}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-400">Registration closes</p>
            <p className="text-sm font-semibold text-neutral-200">
              {formatDeadline(hackathon.registrationDeadline)}
            </p>
          </div>
        </div>

        <p className={`text-xs font-semibold ${urgent ? "text-semantic-warning" : "text-neutral-400"}`}>
          {formatDaysLeft(hackathon.registrationDeadline)}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
          <Badge variant="default">{hackathon.difficulty}</Badge>
        </div>

        <Button
          onClick={() => onExplore(hackathon)}
          variant="primary"
          className="mt-auto w-full gap-1.5"
        >
          Explore
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}

export default HackathonCard;
