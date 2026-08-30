import React, { useMemo, useState } from "react";
import { freeMentors } from "../../data/mentors.js";
import { SearchBar } from "../../components/domain/SearchBar.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { MentorCard } from "../../components/domain/MentorCard.jsx";
import { EmptyState } from "../../components/domain/States.jsx";

import { Shared3CardCarousel } from "../../components/ui/Shared3CardCarousel.jsx";

export function FreeMentors() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ expertise: "", availability: "" });

  const facets = useMemo(
    () => ({
      expertise: [...new Set(freeMentors.map((m) => m.expertise))],
      availability: [...new Set(freeMentors.map((m) => m.availability))],
    }),
    []
  );

  const filtered = freeMentors.filter((m) => {
    const q = query.trim().toLowerCase();
    if (q && !`${m.name} ${m.expertise} ${m.skills.join(" ")}`.toLowerCase().includes(q)) return false;
    if (filters.expertise && m.expertise !== filters.expertise) return false;
    if (filters.availability && m.availability !== filters.availability) return false;
    return true;
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 py-4">
      <header>
        <h1 className="font-display text-3xl font-bold text-neutral-50">Volunteer Mentors</h1>
        <p className="text-sm text-neutral-400 mt-1">Connect with experienced volunteers offering free guidance.</p>
      </header>

      <div className="flex flex-col gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search volunteer mentors by skill or name..." />
        <div className="flex flex-wrap gap-2.5">
          <Select value={filters.expertise} onChange={(e) => setFilters({ ...filters, expertise: e.target.value })}>
            <option value="">All Expertise</option>
            {facets.expertise.map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </Select>

          <Select value={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.value })}>
            <option value="">All Availability</option>
            {facets.availability.map((av) => (
              <option key={av} value={av}>{av}</option>
            ))}
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState 
          message={
            query || Object.values(filters).some(Boolean)
              ? "No volunteer mentors match your filters."
              : "No volunteer mentors available right now — check back soon."
          } 
        />
      ) : (
        <Shared3CardCarousel
          title="Volunteer Mentors Deck"
          items={filtered}
          renderCard={(m) => <MentorCard mentor={m} kind="free" />}
        />
      )}
    </div>
  );
}

export default FreeMentors;
