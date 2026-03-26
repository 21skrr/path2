/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        path: {
          purple: '#7B2D8E',
          'purple-dark': '#5C1F6A',
          'purple-light': '#A855C7',
          teal: '#00B4A6',
          'teal-dark': '#008F84',
          'teal-light': '#2DD4BF',
        },
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  // Ensure Tailwind doesn't conflict with existing vanilla CSS
  corePlugins: {
    preflight: false,
  },
}
