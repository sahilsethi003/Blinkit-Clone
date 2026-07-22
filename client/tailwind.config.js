/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "primary-200" : "#ffbf00",
        "primary-100" : "#ffc929",
        "secondary-200" : "#0c831f",
        "secondary-100" : "#0c1b30",
        "crimson-white" : "#F5F6FB"
      }
    },
  },
  plugins: [],
}

