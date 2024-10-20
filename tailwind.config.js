/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'elliptical-gradient': 'radial-gradient(ellipse 60% 80% at center, #3C5557 0%, #1D2B2C 80%)',
      },
    },
  },
  plugins: [],
}

