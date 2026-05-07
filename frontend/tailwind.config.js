/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        accent: "#e50914",
      },
    },
  },
  plugins: [],
};

