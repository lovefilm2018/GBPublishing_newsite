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
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        'gbp-burgundy': '#8C2520',
        'gbp-burgundy-hover': '#A62D27',
        'gbp-navy': '#1D2A44',
        'gbp-navy-dark': '#121A29',
        'gbp-gold': '#D4A359',
        'gbp-paper': '#FBF9F5',
      },
    },
  },
  plugins: [],
}
