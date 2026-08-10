/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0f14',
        surface: '#12181f',
        surface2: '#1a222b',
        border: '#232d38',
        accent: '#22c55e',
        accent2: '#34d399',
        warn: '#f59e0b',
        danger: '#ef4444',
        muted: '#7c8896'
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' }
        },
        check: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' }
        }
      },
      animation: {
        pop: 'pop 260ms ease-out',
        check: 'check 260ms ease-out forwards'
      }
    }
  },
  plugins: []
};
