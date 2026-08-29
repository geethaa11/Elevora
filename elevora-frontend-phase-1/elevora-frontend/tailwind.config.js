/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0F',
        surface: '#1A1A1D',
        dark: '#111111',
        'dark-secondary': '#1F1F23',
        border: '#2C2C34',
        light: '#E5E7EB',
        gold: {
          DEFAULT: '#B8860B',
          light: '#D9A62E',
          bright: '#F0C048',
        },
        purple: '#6D28D9',
        success: '#22C55E',
        warning: '#FBBF24',
        danger: '#EF4444',
        violet: '#8B5CF6',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 40px rgba(184, 134, 11, 0.25)',
        'gold-sm': '0 0 20px rgba(184, 134, 11, 0.18)',
        'gold-lg': '0 0 80px rgba(184, 134, 11, 0.3)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #B8860B 0%, #F0C048 50%, #B8860B 100%)',
        'ai-gradient': 'linear-gradient(135deg, #B8860B 0%, #8B5CF6 100%)',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 1 },
        },
        drift: {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(6px, -10px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.9 },
        },
      },
      animation: {
        twinkle: 'twinkle 3.5s ease-in-out infinite',
        drift: 'drift 12s ease-in-out infinite',
        'spin-slow': 'spin-slow 120s linear infinite',
        'spin-slower': 'spin-slow 200s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
