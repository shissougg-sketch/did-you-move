/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Calming, warm palette - no harsh colors
        moved: {
          yes: '#86EFAC',      // Soft green
          'kind-of': '#FDE047', // Gentle yellow
          no: '#D1D5DB',       // Neutral gray (not red!)
        },
        feeling: {
          better: '#86EFAC',
          same: '#A5B4FC',
          worse: '#D1D5DB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
