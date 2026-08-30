import React from "react";

const COLORS = ["#B8860B", "#6D28D9", "#3B82F6", "#22C55E", "#EF4444", "#8B5CF6"];

function hashToIndex(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % COLORS.length;
  return Math.abs(h);
}

export function Avatar({ name = "", size = 44, src = "" }) {
  const initials = name
    ? name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";
  const color = COLORS[hashToIndex(name || "User")];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-sans font-semibold text-neutral-50"
      style={{ width: size, height: size, backgroundColor: `${color}33`, color, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

export default Avatar;

