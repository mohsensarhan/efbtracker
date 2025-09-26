import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
        background: "var(--color-surface-primary)",
        foreground: "var(--color-text-primary)",
        "surface-primary": "var(--color-surface-primary)",
        "surface-secondary": "var(--color-surface-secondary)",
        "surface-tertiary": "var(--color-surface-tertiary)",
        "border-strong": "var(--color-border-strong)",
        "border-subtle": "var(--color-border-subtle)",
        "accent-primary": "var(--color-accent-primary)",
        "accent-primary-strong": "var(--color-accent-primary-strong)",
        "accent-positive": "var(--color-accent-positive)",
        "accent-warning": "var(--color-accent-warning)",
        "accent-critical": "var(--color-accent-critical)",
        gray: {
          950: "var(--gray-950)",
          900: "var(--gray-900)",
          850: "var(--gray-850)",
          800: "var(--gray-800)",
          750: "var(--gray-750)",
          700: "var(--gray-700)",
          650: "var(--gray-650)",
          600: "var(--gray-600)",
          550: "var(--gray-550)",
          500: "var(--gray-500)",
          450: "var(--gray-450)",
          400: "var(--gray-400)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
        },
      },
      spacing: {
        "grid-1": "var(--space-1)",
        "grid-2": "var(--space-2)",
        "grid-3": "var(--space-3)",
        "grid-4": "var(--space-4)",
        "grid-6": "var(--space-6)",
        "grid-8": "var(--space-8)",
        "grid-12": "var(--space-12)",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      fontFamily: {
        display: ["\"Inter Display\"", "system-ui", "sans-serif"],
        text: ["\"Inter Text\"", "system-ui", "sans-serif"],
        mono: ["\"JetBrains Mono\"", "monospace"],
      },
      transitionDuration: {
        quick: "150ms",
        base: "300ms",
        deliberate: "400ms",
        journey: "800ms",
      },
      transitionTimingFunction: {
        intent: "cubic-bezier(0.33, 1, 0.68, 1)",
        journey: "cubic-bezier(0.4, 0.0, 0.2, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
