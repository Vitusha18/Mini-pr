/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#00A63C',
          darkgreen: '#008C33',
          lightgreen: '#DCFCE7',
          palegreen: '#F0FDF4',
          dark: '#111827',
          secondary: '#64748B',
          bg: '#F8FAFC',
          border: '#E2E8F0',
        },
        risk: {
          low: '#10B981',
          moderate: '#F59E0B',
          high: '#EF4444',
          critical: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(0, 0, 0, 0.04)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        highlight: '0 10px 30px -5px rgba(0, 166, 60, 0.15)',
      }
    },
  },
  plugins: [],
}
