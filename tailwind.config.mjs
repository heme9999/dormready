import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FFFDFC',
          navy: '#14213D',
          blue: {
            DEFAULT: '#3772FF',
            50: '#EEF5FF',
            100: '#DBEAFF',
            200: '#B8D4FF',
            600: '#255DE0',
            700: '#1D4CC4',
            900: '#0F2C82',
          },
          coral: {
            DEFAULT: '#FF6B5E',
            50: '#FFF1EE',
            100: '#FFE2DE',
            200: '#FFC6BF',
            600: '#E85144',
            700: '#CC3D31',
          },
          mint: {
            DEFAULT: '#42C6A5',
            50: '#ECFAF5',
            100: '#D4F5EC',
            200: '#AAF0DE',
            600: '#28A889',
            700: '#1E876E',
          },
          yellow: {
            DEFAULT: '#FFD166',
            50: '#FFFBEA',
            100: '#FEF3C7',
            200: '#FDE68A',
            600: '#E0AD30',
            700: '#B88714',
          },
          card: '#FFFFFF',
          border: '#E8E4DF',
          muted: '#5A667A',
        },
        cream: {
          50: '#FFFDFC',
          100: '#F9F6F0',
          200: '#F0EAE1',
          300: '#E2D9CE',
          400: '#CFC2B4',
        },
        navy: {
          950: '#0B132B',
          900: '#14213D',
          800: '#1F2E52',
          700: '#35476E',
          600: '#4E618B',
          500: '#6C7EAA',
        },
        forest: {
          50: '#ECFAF5',
          100: '#D4F5EC',
          600: '#42C6A5',
          700: '#28A889',
          800: '#1E876E',
          900: '#146350',
        },
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
          'serif',
        ],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(20, 33, 61, 0.05), 0 2px 6px -1px rgba(20, 33, 61, 0.03)',
        'soft-hover': '0 10px 25px -3px rgba(20, 33, 61, 0.08), 0 4px 10px -2px rgba(20, 33, 61, 0.04)',
        'glow-blue': '0 0 20px -3px rgba(55, 114, 255, 0.25)',
        'glow-coral': '0 0 20px -3px rgba(255, 107, 94, 0.25)',
      }
    },
  },
  plugins: [typography],
}
