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
        void: "var(--bg-void)",
        panel: "var(--bg-panel)",
        glass: "var(--bg-glass)",
        cyan: "var(--accent-cyan)",
        amber: "var(--accent-amber)",
        green: "var(--accent-green)",
        "text-primary": "var(--text-primary)",
        "text-dim": "var(--text-dim)",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      animation: {
        "logo-pulse": "logo-pulse 2s ease-in-out infinite",
        "typing-dot": "typing-dot 0.6s ease-in-out infinite",
        "orbit-spin": "orbit-spin 8s linear infinite",
      },
      keyframes: {
        "logo-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,212,255,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0,212,255,0.6)" },
        },
        "typing-dot": {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.5" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        "orbit-spin": {
          "0%": { transform: "rotate(0deg) translateX(40px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(40px) rotate(-360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
