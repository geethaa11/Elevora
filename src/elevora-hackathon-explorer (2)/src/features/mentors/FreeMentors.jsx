import { useMemo, useState } from "react";
import { freeMentors } from "../../data/mentors.js";
import SearchBar from "../../components/SearchBar.jsx";
import Select from "../../components/Select.jsx";
import MentorCard from "../../components/MentorCard.jsx";
import { EmptyState } from "../../components/States.jsx";

export default function FreeMentors() {
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
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header>
        <h1 className="font-display text-h1 text-neutral-0">Volunteer Mentors</h1>
        <p className="text-body text-neutral-500">Connect with experienced volunteers who want to help students grow.</p>
      </header>

      <div className="flex flex-col gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search volunteer mentors..." />
        <div className="flex flex-wrap gap-2.5">
          <Select label="Expertise" value={filters.expertise} onChange={(v) => setFilters({ ...filters, expertise: v })} options={facets.expertise} />
          <Select
            label="Availability"
            value={filters.availability}
            onChange={(v) => setFilters({ ...filters, availability: v })}
            options={facets.availability}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No volunteer mentors available right now." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MentorCard key={m.id} mentor={m} kind="free" />
          ))}
        </div>
      )}
    </div>
  );
}
