/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        cream: {
          50:  '#FDFCFA',
          100: '#F7F4EF',
          200: '#EDE8DF',
          300: '#E0D9CE',
        },
        stone: {
          warm:  '#C4B9A8',
          mid:   '#9B8E7E',
          deep:  '#6B5D4F',
        },
        forest: {
          50:  '#F0F3EE',
          100: '#D4DDCF',
          200: '#9DAF94',
          300: '#6B8060',
          400: '#4F6843',
          500: '#3D5236',
          600: '#2D3D29',
          700: '#243022',
          800: '#1A2218',
          900: '#121810',
        },
        gold: {
          300: '#E8CFA8',
          400: '#D4B08A',
          500: '#B8966E',
          600: '#9E7E57',
          700: '#7D6242',
        },
        charcoal: '#1C1A17',
        ink:      '#0A0A08',
      },
      letterSpacing: {
        widest: '0.2em',
        ultra:  '0.32em',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in':    'fadeIn 1s ease-out forwards',
        'line-grow':  'lineGrow 1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        lineGrow: {
          '0%':   { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
      },
    },
  },
  plugins: [],
}
