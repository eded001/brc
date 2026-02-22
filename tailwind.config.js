/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#02130A",
        card: "#0F2923",
        surface: "#03382D",
        primary: "#00B37E",
        bright: "#00E887",
        muted: "#7F8F85",
        border: "#1A4033",
        borderSub: "#0D2A1E",
        whiteSoft: "#F0FFF8",
        dim: "#3A6654",
      },
    },
  },
  plugins: [],
}