import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12151C",
          50: "#F3F0E8",
          100: "#E3DECF",
          400: "#5C6478",
          600: "#343B4C",
          800: "#1B1F29",
          900: "#12151C",
        },
        paper: "#F3F0E8",
        seal: {
          DEFAULT: "#E8B34C",
          light: "#F3CE84",
          dark: "#B8842A",
        },
        ledger: {
          DEFAULT: "#2F8F7B",
          light: "#4FB39D",
          dark: "#1F5F51",
        },
        rule: "#3A4256",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "ledger-lines":
          "repeating-linear-gradient(to bottom, transparent, transparent 47px, rgba(243,240,232,0.06) 48px)",
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
