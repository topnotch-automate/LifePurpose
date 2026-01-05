import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF9",
        foreground: "#1C1C1C",
        accent: "#8B7355",
        secondary: "#6B7280",
        border: "#E5E7EB",
        success: "#059669",
        error: "#DC2626",
      },
      fontFamily: {
        serif: ["Crimson Pro", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "h1": ["3.5rem", { lineHeight: "1.2" }],
        "h2": ["2.5rem", { lineHeight: "1.2" }],
        "h3": ["1.875rem", { lineHeight: "1.2" }],
        "h4": ["1.5rem", { lineHeight: "1.2" }],
        "body": ["1.125rem", { lineHeight: "1.7" }],
        "small": ["0.875rem", { lineHeight: "1.5" }],
      },
      spacing: {
        "xs": "0.5rem",
        "sm": "1rem",
        "md": "1.5rem",
        "lg": "2rem",
        "xl": "3rem",
        "2xl": "4rem",
        "3xl": "6rem",
      },
      maxWidth: {
        "reading": "65ch",
        "container": "1200px",
      },
    },
  },
  plugins: [],
};

export default config;

