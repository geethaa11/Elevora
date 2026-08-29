import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-control border border-neutral-700 bg-neutral-800 py-2.5 pl-10 pr-4 text-small font-sans text-neutral-200 placeholder:text-neutral-500 focus:border-gold focus:outline-none"
      />
    </div>
  );
}
