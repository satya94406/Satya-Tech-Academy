/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fff9e6',
          100: '#fdebb3',
          400: '#f5c842',
          500: '#f59e0b',
          600: '#c8960c',
        },
        academy: {
          950: '#070812',
          900: '#0b1020',
          800: '#111827',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        cinzel: ['Cinzel', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 20px 80px rgba(245, 158, 11, 0.15)',
      },
    },
  },
  plugins: [],
}
