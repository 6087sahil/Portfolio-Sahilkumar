/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Instrument Serif', 'Georgia', 'serif'],
        sans: ['Satoshi', 'Plus Jakarta Sans', 'Manrope', 'sans-serif'],
        editorial: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        hand: ['Caveat', 'cursive'],
        handwriting: ['Caveat', 'cursive'],
      },
      colors: {
        paper: {
          DEFAULT: '#F4F1EA',
          muted: '#EDE8DE',
          card: '#FAF8F5',
          dark: '#121110',
        },
        ink: {
          DEFAULT: '#161513',
          muted: '#5C5852',
          faint: '#8E8980',
        },
      },
      boxShadow: {
        'brown-sm': '0 4px 20px -2px rgba(110, 61, 30, 0.22), 0 2px 8px -1px rgba(156, 102, 68, 0.14)',
        'brown-card': '0 12px 36px -6px rgba(110, 61, 30, 0.25), 0 4px 16px -2px rgba(156, 102, 68, 0.18)',
        'brown-lg': '0 20px 50px -8px rgba(110, 61, 30, 0.32), 0 8px 24px -3px rgba(156, 102, 68, 0.22)',
        'brown-glow': '0 0 35px 4px rgba(156, 102, 68, 0.42), 0 12px 35px -6px rgba(110, 61, 30, 0.28)',
        'brown-glow-lg': '0 0 55px 8px rgba(156, 102, 68, 0.55), 0 20px 60px -8px rgba(110, 61, 30, 0.38)',
        'purple-sm': '0 4px 20px -2px rgba(110, 61, 30, 0.22), 0 2px 8px -1px rgba(156, 102, 68, 0.14)',
        'purple-card': '0 12px 36px -6px rgba(110, 61, 30, 0.25), 0 4px 16px -2px rgba(156, 102, 68, 0.18)',
        'purple-lg': '0 20px 50px -8px rgba(110, 61, 30, 0.32), 0 8px 24px -3px rgba(156, 102, 68, 0.22)',
        'purple-glow': '0 0 35px 4px rgba(156, 102, 68, 0.42), 0 12px 35px -6px rgba(110, 61, 30, 0.28)',
        'purple-glow-lg': '0 0 55px 8px rgba(156, 102, 68, 0.55), 0 20px 60px -8px rgba(110, 61, 30, 0.38)',
      },
    },
  },
  plugins: [],
}
