import React from "react";

export function ProgressBar({ value, max = 10, tone = "gold" }) {
  const pct = Math.round((value / max) * 100);
  const barColor = tone === "gold" ? "#B8860B" : tone === "ai" ? "#6D28D9" : "#22C55E";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-700">
      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: barColor }} />
    </div>
  );
}

export function ScoreCard({ label, value, max = 10 }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-700 bg-surface p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-neutral-200">{label}</p>
        <p className="font-display text-xl text-neutral-50">
          {value}
          <span className="text-sm text-neutral-400"> / {max}</span>
        </p>
      </div>
      <ProgressBar value={value} max={max} />
    </div>
  );
}
