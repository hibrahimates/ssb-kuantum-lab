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
          950: '#050d18',
          900: '#0a1628',
          800: '#0f2137',
          700: '#152d4a',
        },
        cyan: {
          glow: '#22d3ee',
          electric: '#06b6d4',
          deep: '#0891b2',
        },
      },
      backgroundImage: {
        'circuit-grid':
          'linear-gradient(rgba(34, 211, 238, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        circuit: '48px 48px',
      },
    },
  },
  plugins: [],
}
