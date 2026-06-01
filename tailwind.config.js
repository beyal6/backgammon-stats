/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          50: '#f8f7ff',
          100: '#f0eeff',
          800: '#1a1828',
          900: '#0f0e1a',
          950: '#07060f',
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
