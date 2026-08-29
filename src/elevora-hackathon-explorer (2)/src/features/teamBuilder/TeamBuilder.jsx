import { useMemo, useState } from "react";
import { students } from "../../data/students.js";
import SearchBar from "../../components/SearchBar.jsx";
import Select from "../../components/Select.jsx";
import StudentCard from "../../components/StudentCard.jsx";
import { EmptyState } from "../../components/States.jsx";
import { useAppState } from "../../context/AppState.jsx";

export default function TeamBuilder() {
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
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-h1 text-neutral-0">Find Your Teammates</h1>
        <p className="text-body text-neutral-500">
          Build a team with people whose skills complement yours.
          {selectedHackathon && <span className="text-gold"> Building for {selectedHackathon.name}.</span>}
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by skills, role or name..." />
        <div className="flex flex-wrap gap-2.5">
          <Select label="Role" value={filters.role} onChange={(v) => setFilters({ ...filters, role: v })} options={facets.roles} />
          <Select label="Skills" value={filters.skill} onChange={(v) => setFilters({ ...filters, skill: v })} options={facets.skills} />
          <Select
            label="Availability"
            value={filters.availability}
            onChange={(v) => setFilters({ ...filters, availability: v })}
            options={facets.availabilities}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No compatible teammates found." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <StudentCard key={s.id} student={s} onConnect={addTeamMember} />
          ))}
        </div>
      )}
    </div>
  );
}
