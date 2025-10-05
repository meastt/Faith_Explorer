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
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Crimson Pro', 'Georgia', 'serif'],
      },
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e5e3',
          200: '#c7cbc7',
          300: '#a3a9a3',
          400: '#808880',
          500: '#666d66',
          600: '#525952',
          700: '#424a42',
          800: '#373e37',
          900: '#2f352f',
          950: '#1a1e1a',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
    },
  },
  plugins: [],
}
