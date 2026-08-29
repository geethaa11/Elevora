// Every badge listed in the brief maps to one of these looks. Domain/tag
// badges stay neutral so they don't compete with the semantic ones
// (Featured, Beginner Friendly, urgency) for attention.
const TONES = {
  ai: "bg-ai/15 text-[#a889f0] border border-ai/30",
  featured: "bg-warning/15 text-warning border border-warning/30",
  recommended: "bg-info/15 text-info border border-info/30",
  popular: "bg-gold/15 text-gold border border-gold/30",
  beginner: "bg-success/15 text-success border border-success/30",
  neutral: "bg-neutral-800 text-neutral-200 border border-neutral-700",
  free: "bg-success/15 text-success border border-success/30",
  paid: "bg-gold/15 text-gold border border-gold/30",
};

const PRESETS = {
  "AI Powered": "ai",
  Featured: "featured",
  Recommended: "recommended",
  Popular: "popular",
  "Beginner Friendly": "beginner",
  Online: "neutral",
  Offline: "neutral",
  Hybrid: "neutral",
  Free: "free",
  Paid: "paid",
};

export default function Badge({ children, tone }) {
  const resolved = tone || PRESETS[children] || "neutral";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-caption font-semibold font-sans ${TONES[resolved]}`}
    >
      {children}
    </span>
  );
}
