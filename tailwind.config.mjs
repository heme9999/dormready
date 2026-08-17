/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF8F5',
          200: '#F4EFEA',
          300: '#E8E1D7',
          400: '#D5C8B8',
          500: '#B8A48F',
        },
        navy: {
          950: '#070C18',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
        },
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          600: '#16A34A',
          700: '#15803D',
          800: '#0D5C3E',
          900: '#0A432D',
          950: '#052A1C',
        },
        amberAccent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        serif: [
          '"Newsreader"',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'Times',
          'serif',
        ],
      },
    },
  },
  plugins: [],
}
