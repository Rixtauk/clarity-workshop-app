/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#2f3857',
          'navy-dark': '#3b435d',
        },
      },
    },
  },
  plugins: [],
};
