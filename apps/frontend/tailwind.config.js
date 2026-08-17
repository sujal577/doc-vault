/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        vault: {
          bg: "#f7f6f3",
          surface: "#ffffff",
          border: "#e4e2dc",
          "border-subtle": "#eeede9",
          text: "#1c1c1e",
          muted: "#6e6e73",
          accent: "#5b4fd9",
          "accent-hover": "#4a3fc4",
          "accent-soft": "#eeecfb",
          warning: "#b45309",
          "warning-soft": "#fef3e2",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 3px rgba(28, 28, 30, 0.06), 0 1px 2px rgba(28, 28, 30, 0.04)",
        card: "0 1px 4px rgba(28, 28, 30, 0.05), 0 4px 16px rgba(28, 28, 30, 0.04)",
      },
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0deg)" },
          "15%": { transform: "rotate(14deg)" },
          "30%": { transform: "rotate(-8deg)" },
          "45%": { transform: "rotate(14deg)" },
          "60%": { transform: "rotate(-4deg)" },
          "75%": { transform: "rotate(10deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        wave: "wave 0.8s ease-in-out 1",
      },
    },
  },
  plugins: [],
};
