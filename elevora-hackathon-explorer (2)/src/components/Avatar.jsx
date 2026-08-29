const COLORS = ["#B8860B", "#6D38D9", "#3083F6", "#22C55E", "#EF4444", "#8B5CF6"];

function hashToIndex(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % COLORS.length;
  return Math.abs(h);
}

export default function Avatar({ name, size = 44 }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const color = COLORS[hashToIndex(name)];

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-sans font-semibold text-neutral-0"
      style={{ width: size, height: size, backgroundColor: `${color}33`, color, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}
