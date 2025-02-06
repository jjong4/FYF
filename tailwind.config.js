/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        pretendard: ['var(--font-pretendard)'],
      },
      animation: {
        'breathing': 'breathing 4s ease-in-out infinite',
        'breathing-gallery': 'breathing-gallery 4s ease-in-out infinite',
        'ink-absorb': 'ink-absorb 1s ease-out forwards',
        'roll-in': 'roll-in 1s ease-out'
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        'breathing-gallery': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.9)' }
        },
        'ink-absorb': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'roll-in': {
          '0%': { transform: 'translateX(-100%) rotate(-720deg)' },
          '100%': { transform: 'translateX(0) rotate(0deg)' }
        }
      }
    },
  },
  plugins: [],
} 