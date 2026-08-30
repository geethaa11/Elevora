import React, { useState, useEffect } from "react";

export function ProgressBar({ value, max = 10, tone = "gold" }) {
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const targetPct = Math.round((value / max) * 100);
    const timeout = setTimeout(() => {
      setAnimatedPct(targetPct);
    }, 100);
    return () => clearTimeout(timeout);
  }, [value, max]);

  const barColor =
    tone === "gold"
      ? "linear-gradient(90deg, #D4AF37 0%, #FFD700 100%)"
      : tone === "ai"
      ? "linear-gradient(90deg, #8B5CF6 0%, #C084FC 100%)"
      : "linear-gradient(90deg, #10B981 0%, #34D399 100%)";

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800/90 border border-neutral-700/50">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
        style={{ width: `${animatedPct}%`, background: barColor }}
      />
    </div>
  );
}

export function ScoreCard({ label, value, max = 10, tone = "gold" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = typeof value === "number" ? value : parseFloat(value) || 0;
    const duration = 1200; // ms
    const steps = 30;
    const stepTime = duration / steps;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(start * 10) / 10);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="group flex flex-col gap-2.5 rounded-xl border border-neutral-700 bg-surface/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/60 hover:shadow-lg hover:shadow-[#D4AF37]/10">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-neutral-200 group-hover:text-neutral-100 transition-colors">
          {label}
        </p>
        <p className="font-display text-xl font-bold text-[#FFD700]">
          {displayValue}
          <span className="text-xs font-normal text-neutral-400"> / {max}</span>
        </p>
      </div>
      <ProgressBar value={value} max={max} tone={tone} />
    </div>
  );
}

export default ScoreCard;
