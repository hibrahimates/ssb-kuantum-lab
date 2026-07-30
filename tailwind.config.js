/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        navy: {
          950: 'var(--color-navy-950)',
          900: 'var(--color-navy-900)',
          800: 'var(--color-navy-800)',
          700: 'var(--color-navy-700)',
        },
        cyan: {
          glow: 'var(--color-cyan-glow)',
          electric: 'var(--color-cyan-electric)',
          deep: 'var(--color-cyan-deep)',
        },
        slate: {
          200: 'var(--color-slate-200)',
          300: 'var(--color-slate-300)',
          400: 'var(--color-slate-400)',
          500: 'var(--color-slate-500)',
        },
        white: 'var(--color-white)',
      },
      backgroundImage: {
        'circuit-grid':
          'linear-gradient(color-mix(in srgb, var(--color-cyan-glow) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-cyan-glow) 8%, transparent) 1px, transparent 1px)',
      },
      backgroundSize: {
        circuit: '48px 48px',
      },
    },
  },
  plugins: [],
}
