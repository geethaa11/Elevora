import Select from "./Select.jsx";

export const SORT_OPTIONS = [
  "Deadline",
  "Prize",
  "Recently Added",
  "Recommended",
  "Popular",
];

export default function FilterBar({ filters, onChange, facets, sort, onSortChange }) {
  const set = (key) => (val) => onChange({ ...filters, [key]: val });

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Select label="Domain" value={filters.domain} onChange={set("domain")} options={facets.domains} />
      <Select label="Prize Pool" value={filters.prize} onChange={set("prize")} options={facets.prizeBands} />
      <Select label="Mode" value={filters.mode} onChange={set("mode")} options={facets.modes} />
      <Select label="Difficulty" value={filters.difficulty} onChange={set("difficulty")} options={facets.difficulties} />
      <Select label="Team Size" value={filters.teamSize} onChange={set("teamSize")} options={facets.teamSizes} />
      <Select label="Organizer" value={filters.organizer} onChange={set("organizer")} options={facets.organizers} />

      <div className="ml-auto">
        <Select label="Sort: Deadline" value={sort} onChange={onSortChange} options={SORT_OPTIONS} />
      </div>
    </div>
  );
}
