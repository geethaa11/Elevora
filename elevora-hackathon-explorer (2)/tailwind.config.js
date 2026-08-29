/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary
        bg: "#0D0D0F",
        surface: "#1A1A1D",
        gold: "#B8860B",
        ai: "#6D38D9",
        // Neutrals
        neutral: {
          900: "#111111",
          800: "#1F1F23",
          700: "#2C2C34",
          200: "#E5E7EB",
          0: "#FFFFFF",
        },
        // Semantic
        success: "#22C55E",
        warning: "#FBBF24",
        error: "#EF4444",
        info: "#3083F6",
        "ai-accent": "#8B5CF6",
      },
      fontFamily: {
        display: ["'DM Serif Display'", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        display: ["56px", { lineHeight: "64px" }],
        h1: ["40px", { lineHeight: "48px" }],
        h2: ["32px", { lineHeight: "40px" }],
        h3: ["24px", { lineHeight: "32px" }],
        h4: ["20px", { lineHeight: "28px" }],
        body: ["16px", { lineHeight: "24px" }],
        small: ["14px", { lineHeight: "20px" }],
        caption: ["12px", { lineHeight: "16px" }],
      },
      borderRadius: {
        card: "16px",
        control: "10px",
      },
      boxShadow: {
        card: "0 8px 24px -12px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
};
