import { useMemo, useState } from "react";
import { paidMentors } from "../../data/mentors.js";
import SearchBar from "../../components/SearchBar.jsx";
import Select from "../../components/Select.jsx";
import MentorCard from "../../components/MentorCard.jsx";
import { EmptyState } from "../../components/States.jsx";

export default function PaidMentors() {
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
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header>
        <h1 className="font-display text-h1 text-neutral-0">Expert Mentors</h1>
        <p className="text-body text-neutral-500">Book focused 1:1 guidance from experienced mentors.</p>
      </header>

      <div className="flex flex-col gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search expert mentors..." />
        <div className="flex flex-wrap gap-2.5">
          <Select label="Expertise" value={filters.expertise} onChange={(v) => setFilters({ ...filters, expertise: v })} options={facets.expertise} />
          <Select label="Experience" value={filters.experience} onChange={(v) => setFilters({ ...filters, experience: v })} options={facets.experience} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No experts match your filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MentorCard key={m.id} mentor={m} kind="paid" />
          ))}
        </div>
      )}
    </div>
  );
}
