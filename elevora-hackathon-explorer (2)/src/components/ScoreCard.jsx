export function ProgressBar({ value, max = 10, tone = "gold" }) {
  const pct = Math.round((value / max) * 100);
  const barColor = tone === "gold" ? "#B8860B" : tone === "ai" ? "#6D38D9" : "#22C55E";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-700">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
    </div>
  );
}

export function ScoreCard({ label, value, max = 10 }) {
  return (
    <div className="flex flex-col gap-2 rounded-card border border-neutral-700 bg-neutral-800 p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-small text-neutral-500">{label}</p>
        <p className="font-display text-h4 text-neutral-0">
          {value}
          <span className="text-small text-neutral-500"> / {max}</span>
        </p>
      </div>
      <ProgressBar value={value} max={max} />
    </div>
  );
}
