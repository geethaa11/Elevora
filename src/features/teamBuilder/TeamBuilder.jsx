import React, { useMemo, useState } from "react";
import { students } from "../../data/students.js";
import { SearchBar } from "../../components/domain/SearchBar.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { StudentCard } from "../../components/domain/StudentCard.jsx";
import { EmptyState } from "../../components/domain/States.jsx";
import { useAppState } from "../../context/AppStateContext.jsx";

import { Shared3CardCarousel } from "../../components/ui/Shared3CardCarousel.jsx";

export function TeamBuilder() {
  const { selectedHackathon, addTeamMember } = useAppState();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ role: "", skill: "", availability: "" });

  const facets = useMemo(
    () => ({
      roles: [...new Set(students.map((s) => s.role))].sort(),
      skills: [...new Set(students.flatMap((s) => s.skills))].sort(),
      availabilities: [...new Set(students.map((s) => s.availability))],
    }),
    []
  );

  const filtered = students.filter((s) => {
    const q = query.trim().toLowerCase();
    if (q && !`${s.name} ${s.role} ${s.skills.join(" ")}`.toLowerCase().includes(q)) return false;
    if (filters.role && s.role !== filters.role) return false;
    if (filters.skill && !s.skills.includes(filters.skill)) return false;
    if (filters.availability && s.availability !== filters.availability) return false;
    return true;
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold text-neutral-50">Find Your Teammates</h1>
        <p className="text-sm text-neutral-400">
          Build a team with people whose skills complement yours.
          {selectedHackathon && <span className="text-primary font-semibold"> Building for {selectedHackathon.name}.</span>}
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by skills, role or name..." />
        <div className="flex flex-wrap gap-2.5">
          <Select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
            <option value="">All Roles</option>
            {facets.roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>

          <Select value={filters.skill} onChange={(e) => setFilters({ ...filters, skill: e.target.value })}>
            <option value="">All Skills</option>
            {facets.skills.map((sk) => (
              <option key={sk} value={sk}>{sk}</option>
            ))}
          </Select>

          <Select value={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.value })}>
            <option value="">All Availability</option>
            {facets.availabilities.map((av) => (
              <option key={av} value={av}>{av}</option>
            ))}
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState 
          message={
            query || Object.values(filters).some(Boolean)
              ? "No compatible teammates match your filters."
              : "No teammates available yet — check back soon."
          } 
        />
      ) : (
        <Shared3CardCarousel
          title="Teammate Recommendations"
          items={filtered}
          renderCard={(student) => (
            <StudentCard student={student} onConnect={addTeamMember} />
          )}
        />
      )}
    </div>
  );
}

export default TeamBuilder;
