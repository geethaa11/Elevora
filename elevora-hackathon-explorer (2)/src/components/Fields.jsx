export function Input({ label, helper, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-small font-medium text-neutral-200">{label}</span>}
      <input
        {...props}
        className="rounded-control border border-neutral-700 bg-neutral-800 px-3.5 py-2.5 text-small font-sans text-neutral-200 placeholder:text-neutral-500 focus:border-gold focus:outline-none"
      />
      {helper && <span className="text-caption text-neutral-500">{helper}</span>}
    </label>
  );
}

export function Textarea({ label, helper, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-small font-medium text-neutral-200">{label}</span>}
      <textarea
        {...props}
        rows={props.rows || 4}
        className="resize-none rounded-control border border-neutral-700 bg-neutral-800 px-3.5 py-2.5 text-small font-sans text-neutral-200 placeholder:text-neutral-500 focus:border-gold focus:outline-none"
      />
      {helper && <span className="text-caption text-neutral-500">{helper}</span>}
    </label>
  );
}

export function FieldSelect({ label, value, onChange, options, helper }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-small font-medium text-neutral-200">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-control border border-neutral-700 bg-neutral-800 px-3.5 py-2.5 text-small font-sans text-neutral-200 focus:border-gold focus:outline-none"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {helper && <span className="text-caption text-neutral-500">{helper}</span>}
    </label>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-neutral-700">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2.5 text-small font-medium font-sans transition-colors ${
            active === tab
              ? "border-b-2 border-gold text-gold"
              : "text-neutral-500 hover:text-neutral-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function RadioCard({ label, sub, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-control border px-4 py-3 text-left transition-colors ${
        selected ? "border-gold bg-gold/10" : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
      }`}
    >
      <div>
        <p className="text-small font-semibold text-neutral-0">{label}</p>
        {sub && <p className="text-caption text-neutral-500">{sub}</p>}
      </div>
      <span
        className={`h-4 w-4 shrink-0 rounded-full border-2 ${
          selected ? "border-gold bg-gold" : "border-neutral-600"
        }`}
      />
    </button>
  );
}
