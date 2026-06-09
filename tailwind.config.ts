import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        graphite: "#2f3645",
        cloud: "#f7f8fb",
        line: "#e6e8ef",
        lagoon: "#0f766e",
        marine: "#1d4ed8",
        ember: "#f59e0b",
        coral: "#e11d48"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(17, 24, 39, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
