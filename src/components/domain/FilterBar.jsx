import React from "react";
import { Select } from "../ui/Select";

export const SORT_OPTIONS = [
  "Deadline",
  "Prize",
  "Recently Added",
  "Recommended",
  "Popular",
];

export function FilterBar({ filters, onChange, facets, sort, onSortChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Select value={filters.domain} onChange={set("domain")}>
        <option value="">All Domains</option>
        {facets.domains.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </Select>

      <Select value={filters.prize} onChange={set("prize")}>
        <option value="">All Prize Pools</option>
        {facets.prizeBands.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </Select>

      <Select value={filters.mode} onChange={set("mode")}>
        <option value="">All Modes</option>
        {facets.modes.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </Select>

      <Select value={filters.difficulty} onChange={set("difficulty")}>
        <option value="">All Difficulties</option>
        {facets.difficulties.map((diff) => (
          <option key={diff} value={diff}>{diff}</option>
        ))}
      </Select>

      <Select value={filters.teamSize} onChange={set("teamSize")}>
        <option value="">All Team Sizes</option>
        {facets.teamSizes.map((ts) => (
          <option key={ts} value={ts}>{ts}</option>
        ))}
      </Select>

      <Select value={filters.organizer} onChange={set("organizer")}>
        <option value="">All Organizers</option>
        {facets.organizers.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </Select>

      <div className="ml-auto">
        <Select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          {SORT_OPTIONS.map((s) => (
            <option key={s} value={s}>Sort: {s}</option>
          ))}
        </Select>
      </div>
    </div>
  );
}

export default FilterBar;
