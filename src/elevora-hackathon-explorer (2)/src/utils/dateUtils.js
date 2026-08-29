// All the "which bucket does this hackathon belong to" logic lives here,
// so the explorer page itself just renders sections rather than deciding them.

const DAY_MS = 1000 * 60 * 60 * 24;

export function daysRemaining(deadlineISO, now = new Date()) {
  const deadline = new Date(deadlineISO);
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / DAY_MS);
}

export function formatDeadline(deadlineISO) {
  return new Date(deadlineISO).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export function formatDaysLeft(deadlineISO, now = new Date()) {
  const days = daysRemaining(deadlineISO, now);
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

// One hackathon can only live in one section on first load, even though the
// quick-filter chips let you re-slice the same data by a looser window.
export function getPrimarySection(hackathon, now = new Date()) {
  const days = daysRemaining(hackathon.registrationDeadline, now);
  if (days < 0) return "closed";
  if (days <= 3) return "closingSoon";
  if (days <= 7) return "thisWeek";
  if (days <= 14) return "next7Days";
  if (days <= 31) return "thisMonth";
  if (days <= 62) return "upcoming";
  return "nextMonth";
}

export const SECTION_META = {
  closingSoon: { label: "Closing soon", emoji: "🔥" },
  thisWeek: { label: "This week", emoji: null },
  next7Days: { label: "Next 7 days", emoji: null },
  thisMonth: { label: "This month", emoji: null },
  upcoming: { label: "Upcoming", emoji: null },
  nextMonth: { label: "Next month", emoji: null },
};

export const QUICK_FILTERS = [
  { id: "all", label: "All" },
  { id: "closingSoon", label: "Closing soon" },
  { id: "thisWeek", label: "This week" },
  { id: "next7Days", label: "Next 7 days" },
  { id: "thisMonth", label: "This month" },
  { id: "upcoming", label: "Upcoming" },
  { id: "nextMonth", label: "Next month" },
];

export function groupByMonth(hackathons) {
  const groups = {};
  hackathons.forEach((h) => {
    const key = new Date(h.eventStart).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
    groups[key] = groups[key] || [];
    groups[key].push(h);
  });
  return groups;
}
