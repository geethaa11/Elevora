/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0F',
        surface: '#1A1A1D',
        primary: '#B8860B', // Gold
        secondary: '#6D28D9', // Purple
        neutral: {
          900: '#111111',
          800: '#1F1F23',
          700: '#2C2C34', // borders/dividers
          200: '#E5E7EB', // secondary text
          50: '#FFFFFF',  // primary text
        },
        semantic: {
          success: '#22C55E',
          warning: '#FBBF24',
          danger: '#EF4444',
          info: '#3B82F6',
          ai: '#8B5CF6',
        }
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
