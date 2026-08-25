import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        border: "var(--border)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        maroon: "var(--maroon)",
        brass: "var(--brass)"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      maxWidth: {
        content: "72rem"
      }
    }
  },
  plugins: []
};

export default config;
