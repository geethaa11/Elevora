import React from "react";
import HackathonCard from "./HackathonCard.jsx";

export function TimeSection({ title, emoji, hackathons, onExplore }) {
  if (!hackathons || hackathons.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-xl font-bold text-neutral-50 flex items-center gap-2">
        {emoji && <span>{emoji}</span>}
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hackathons.map((h) => (
          <HackathonCard key={h.id} hackathon={h} onExplore={onExplore} />
        ))}
      </div>
    </section>
  );
}

export default TimeSection;
