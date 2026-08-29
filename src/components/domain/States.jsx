import React from "react";
import { SearchX } from "lucide-react";

export function EmptyState({ message = "No hackathons match your filters." }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-700 py-16 text-center">
      <SearchX className="h-8 w-8 text-neutral-500" />
      <p className="text-base text-neutral-200">{message}</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-xl border border-neutral-700 bg-surface"
        />
      ))}
    </div>
  );
}
