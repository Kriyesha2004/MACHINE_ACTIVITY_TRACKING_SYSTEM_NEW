/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#111827',
          light: '#F9FAFB',
        },
        secondary: {
          dark: '#1F2937',
          light: '#9CA3AF',
        },
        accent: {
          primary: '#6366F1',
          secondary: '#EF4444',
        }
      }
    },
  },
  plugins: [],
}
