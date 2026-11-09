/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#102A43",
        teal: "#0D9488",
        mist: "#F0F4F8",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 42, 67, 0.10)",
      },
    },
  },
  plugins: [],
};
