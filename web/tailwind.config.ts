import type { Config } from "tailwindcss";
import tokens from "../brand/tokens.json";

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        green: { DEFAULT: tokens.colors["p-green"], dark: tokens.colors["p-green-dark"], soft: tokens.colors["p-green-soft"] },
        yellow: { DEFAULT: tokens.colors["p-yellow"], soft: tokens.colors["p-yellow-soft"] },
        ink: { DEFAULT: tokens.colors["p-ink"], 2: tokens.colors["p-ink-2"] },
        bg: tokens.colors["p-bg"],
        line: tokens.colors["p-line"],
        danger: tokens.colors["p-danger"]
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      borderRadius: { "2xl": "1.25rem", "3xl": "1.75rem" },
      boxShadow: {
        card: "0 4px 24px rgba(43,178,76,0.08)",
        lift: "0 8px 32px rgba(15,27,20,0.12)",
        glow: "0 0 0 4px rgba(245,197,24,0.25)"
      },
      transitionTimingFunction: { brand: "cubic-bezier(0.22,1,0.36,1)" },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        spinSlow: { to: { transform: "rotate(360deg)" } },
        floatA: { "0%,100%": { transform: "translate(0,0)" }, "50%": { transform: "translate(40px,-30px)" } },
        floatB: { "0%,100%": { transform: "translate(0,0)" }, "50%": { transform: "translate(-30px,40px)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        gradientSweep: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } }
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        spinSlow: "spinSlow 20s linear infinite",
        floatA: "floatA 14s ease-in-out infinite",
        floatB: "floatB 18s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        gradientSweep: "gradientSweep 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
export default config;
