export default function Placeholder({ title }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-2 px-6 py-24 text-center">
      <h1 className="font-display text-h2 text-neutral-0">{title}</h1>
      <p className="text-body text-neutral-500">
        Outside Frontend B's scope for this drop — not built here.
      </p>
    </div>
  );
}
