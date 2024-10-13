/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Ensure this is 'class' so dark mode is based on the 'dark' class
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"], // Ensure Inter font is used
      },
    },
  },
  plugins: [],
};
