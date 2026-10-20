import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080D18",
        panel: "#101827",
        elevated: "#172235",
        brand: {
          cyan: "#22D3EE",
          blue: "#3B82F6",
        },
        status: {
          success: "#34D399",
          warning: "#FBBF24",
          critical: "#F87171",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
        },
        border: {
          subtle: "#1E293B",
          glow: "rgba(34, 211, 238, 0.2)",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(34, 211, 238, 0.25)",
        "glow-critical": "0 0 20px -5px rgba(248, 113, 113, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-scan": "scan 4s linear infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
