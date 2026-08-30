import React from "react";
import HackathonCard from "./HackathonCard.jsx";
import { Shared3CardCarousel } from "../ui/Shared3CardCarousel.jsx";

export function TimeSection({ title, emoji, hackathons, onExplore }) {
  if (!hackathons || hackathons.length === 0) return null;

  const sectionTitle = `${emoji ? emoji + " " : ""}${title}`;

  return (
    <section className="flex flex-col gap-4 py-2">
      <Shared3CardCarousel
        title={sectionTitle}
        items={hackathons}
        renderCard={(h) => <HackathonCard hackathon={h} onExplore={onExplore} />}
      />
    </section>
  );
}

export default TimeSection;


