/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        jugaad: {
          purple: '#5B4BB1',
          'purple-light': '#7B6BD1',
          'purple-dark': '#3E3188',
          pink: '#FD5DC9',
          'pink-light': '#FE7DD6',
          'pink-dark': '#E33DAE',
          yellow: '#FBB328',
          peach: '#FABFA4',
          gray: '#A3ABB1',
          'off-white': '#FEFEFE',
          'near-black': '#040404',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'ripple-pulse': 'ripplePulse 1.5s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        ripplePulse: {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px)' },
          '75%': { transform: 'translateX(8px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(91, 75, 177, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(253, 93, 201, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};
