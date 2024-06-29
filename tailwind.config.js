/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        SIL: ["Shadows Into Light", "cursive"],
      },
    },
  },
  plugins: [],
};
