/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        marquee2: 'marquee2 40s linear infinite',
        'shockwave-1': 'shockwave 2s infinite',
        'shockwave-2': 'shockwave 2s infinite 0.3s',
        'shockwave-3': 'shockwave 2s infinite 0.6s',
        'arrow-updown': 'updown 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shockwave: {
          '0%': {
            transform: 'scale(1)',
            opacity: 1
          },
          '100%': {
            transform: 'scale(2)',
            opacity: 0
          }
        },
        updown: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15%)' },
        },
      },
      transitionDuration: {
        '1000': '1000ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.17, 0.55, 0.55, 1)',
      },
      utilities: {
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwindcss-animate'),
    require('@tailwindcss/line-clamp'),
  ],
  daisyui: {
    themes: ['light'],
  },
};
