/** @type {import('tailwindcss').Config} */
import path from "path";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        pulseSlow: "pulse 3s infinite",
      },
    },
  },
  plugins: [],
};
