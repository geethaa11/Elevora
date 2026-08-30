import React, { useMemo, useState } from "react";
import { paidMentors } from "../../data/mentors.js";
import { SearchBar } from "../../components/domain/SearchBar.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { MentorCard } from "../../components/domain/MentorCard.jsx";
import { EmptyState } from "../../components/domain/States.jsx";

import { Shared3CardCarousel } from "../../components/ui/Shared3CardCarousel.jsx";

export function PaidMentors() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ expertise: "", experience: "" });

  const facets = useMemo(
    () => ({
      expertise: [...new Set(paidMentors.map((m) => m.expertise))],
      experience: [...new Set(paidMentors.map((m) => m.experience))],
    }),
    []
  );

  const filtered = paidMentors.filter((m) => {
    const q = query.trim().toLowerCase();
    if (q && !`${m.name} ${m.expertise} ${m.skills.join(" ")}`.toLowerCase().includes(q)) return false;
    if (filters.expertise && m.expertise !== filters.expertise) return false;
    if (filters.experience && m.experience !== filters.experience) return false;
    return true;
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 py-4">
      <header>
        <h1 className="font-display text-3xl font-bold text-neutral-50">Expert Mentors</h1>
        <p className="text-sm text-neutral-400 mt-1">Book focused 1:1 sessions with verified hackathon experts.</p>
      </header>

      <div className="flex flex-col gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search expert mentors by skill or name..." />
        <div className="flex flex-wrap gap-2.5">
          <Select value={filters.expertise} onChange={(e) => setFilters({ ...filters, expertise: e.target.value })}>
            <option value="">All Expertise</option>
            {facets.expertise.map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </Select>

          <Select value={filters.experience} onChange={(e) => setFilters({ ...filters, experience: e.target.value })}>
            <option value="">All Experience Levels</option>
            {facets.experience.map((exp) => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No experts match your filters." />
      ) : (
        <Shared3CardCarousel
          title="Expert Mentors Deck"
          items={filtered}
          renderCard={(m) => <MentorCard mentor={m} kind="paid" />}
        />
      )}
    </div>
  );
}

export default PaidMentors;
