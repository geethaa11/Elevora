import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hackathons as allHackathons } from "../../data/hackathons.js";
import SearchBar from "../../components/SearchBar.jsx";
import FilterBar from "../../components/FilterBar.jsx";
import TimeSection from "../../components/TimeSection.jsx";
import { EmptyState, LoadingState } from "../../components/States.jsx";
import {
  getPrimarySection,
  SECTION_META,
  QUICK_FILTERS,
  groupByMonth,
} from "../../utils/dateUtils.js";

const SECTION_ORDER = [
  "closingSoon",
  "thisWeek",
  "next7Days",
  "thisMonth",
  "upcoming",
  "nextMonth",
];

// "Upcoming" and "Next month" are where the brief specifically asked for a
// by-month breakdown (SEPTEMBER / OCTOBER ...) rather than one flat grid.
const MONTH_GROUPED_SECTIONS = new Set(["upcoming", "nextMonth"]);

function parsePrize(prize) {
  const match = prize.replace(/,/g, "").match(/[\d]+/);
  return match ? Number(match[0]) : 0;
}

const PRIZE_BANDS = [
  { label: "Under ₹50,000", test: (p) => p < 50000 },
  { label: "₹50,000 – ₹1,00,000", test: (p) => p >= 50000 && p <= 100000 },
  { label: "Above ₹1,00,000", test: (p) => p > 100000 },
];

export default function HackathonExplorer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState("all");
  const [sort, setSort] = useState("Deadline");
  const [filters, setFilters] = useState({
    domain: "",
    prize: "",
    mode: "",
    difficulty: "",
    teamSize: "",
    organizer: "",
  });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const facets = useMemo(
    () => ({
      domains: [...new Set(allHackathons.map((h) => h.domain))].sort(),
      modes: [...new Set(allHackathons.map((h) => h.mode))].sort(),
      difficulties: [...new Set(allHackathons.map((h) => h.difficulty))],
      teamSizes: [...new Set(allHackathons.map((h) => h.teamSize))],
      organizers: [...new Set(allHackathons.map((h) => h.organizer))].sort(),
      prizeBands: PRIZE_BANDS.map((b) => b.label),
    }),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allHackathons.filter((h) => {
      if (q) {
        const haystack = `${h.name} ${h.organizer} ${h.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.domain && h.domain !== filters.domain) return false;
      if (filters.mode && h.mode !== filters.mode) return false;
      if (filters.difficulty && h.difficulty !== filters.difficulty) return false;
      if (filters.teamSize && h.teamSize !== filters.teamSize) return false;
      if (filters.organizer && h.organizer !== filters.organizer) return false;
      if (filters.prize) {
        const band = PRIZE_BANDS.find((b) => b.label === filters.prize);
        if (band && !band.test(parsePrize(h.prize))) return false;
      }
      if (quickFilter !== "all" && getPrimarySection(h) !== quickFilter) return false;
      return true;
    });
  }, [query, filters, quickFilter]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case "Prize":
        return list.sort((a, b) => parsePrize(b.prize) - parsePrize(a.prize));
      case "Recently Added":
        return list.reverse();
      case "Recommended":
        return list.sort((a, b) => Number(b.featured) - Number(a.featured));
      case "Popular":
        return list.sort((a, b) => Number(b.popular) - Number(a.popular));
      case "Deadline":
      default:
        return list.sort(
          (a, b) => new Date(a.registrationDeadline) - new Date(b.registrationDeadline)
        );
    }
  }, [filtered, sort]);

  const sections = useMemo(() => {
    const buckets = Object.fromEntries(SECTION_ORDER.map((s) => [s, []]));
    sorted.forEach((h) => {
      const section = getPrimarySection(h);
      if (buckets[section]) buckets[section].push(h);
    });
    return buckets;
  }, [sorted]);

  const handleExplore = (hackathon) => {
    navigate(`/hackathons/${hackathon.id}`);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-h1 text-neutral-0">Hackathon Explorer</h1>
        <p className="text-body text-neutral-500">Find the right hackathon at the right time.</p>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <SearchBar value={query} onChange={setQuery} placeholder="Search hackathons..." />
        </div>
        <FilterBar filters={filters} onChange={setFilters} facets={facets} sort={sort} onSortChange={setSort} />

        <div className="chip-row -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:px-0">
          {QUICK_FILTERS.map((qf) => (
            <button
              key={qf.id}
              onClick={() => setQuickFilter(qf.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-small font-medium font-sans transition-colors ${
                quickFilter === qf.id
                  ? "bg-gold text-neutral-900"
                  : "border border-neutral-700 text-neutral-200 hover:border-gold/50"
              }`}
            >
              {qf.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : sorted.length === 0 ? (
        <EmptyState message="No hackathons match your filters." />
      ) : (
        <div className="flex flex-col gap-10">
          {SECTION_ORDER.map((sectionId) => {
            const items = sections[sectionId];
            if (items.length === 0) return null;
            const meta = SECTION_META[sectionId];

            if (MONTH_GROUPED_SECTIONS.has(sectionId)) {
              const byMonth = groupByMonth(items);
              return (
                <div key={sectionId} className="flex flex-col gap-8">
                  <h2 className="font-display text-h3 text-neutral-0">{meta.label}</h2>
                  {Object.entries(byMonth).map(([month, monthItems]) => (
                    <TimeSection
                      key={month}
                      title={month.toUpperCase()}
                      hackathons={monthItems}
                      onExplore={handleExplore}
                    />
                  ))}
                </div>
              );
            }

            return (
              <TimeSection
                key={sectionId}
                title={meta.label}
                emoji={meta.emoji}
                hackathons={items}
                onExplore={handleExplore}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
