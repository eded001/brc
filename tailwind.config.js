/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ── Fundos ──────────────────────────────────────────
        bg: "#02130A",
        card: "#0F2923",
        surface: "#03382D",

        // ── Verdes de destaque ───────────────────────────────
        primary: "#00B37E",
        bright: "#00E887",
        dim: "#3A6654",
        muted: "#7F8F85",

        // ── Bordas ──────────────────────────────────────────
        border: "#1A4033",
        borderSub: "#0D2A1E",

        // ── Texto ───────────────────────────────────────────
        whiteSoft: "#F0FFF8",

        // ── Estados & feedback ────────────────────────────────
        success: "#00C48C",
        warning: "#F5A623",
        danger: "#E05252",
        info: "#4DA8DA",

        // ── Overlay / scrim ──────────────────────────────────
        overlay: "rgba(2, 19, 10, 0.72)",
      },
    },
  },
  plugins: [],
};