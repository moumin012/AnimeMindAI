/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'Cairo', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eefbf3',
          100: '#d6f6e3',
          200: '#b0ecc8',
          300: '#7adb9f',
          400: '#41c070',
          500: '#1ea150', // Emerald green brand color
          600: '#14813e',
          700: '#126633',
          800: '#12512b',
          900: '#104325',
        },
        slate: {
          850: '#162032',
          950: '#0b1120',
        }
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        }
      },
      animation: {
        'pulse-slow': 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
