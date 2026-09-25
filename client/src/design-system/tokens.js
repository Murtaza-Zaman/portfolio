/**
 * Centralized Design System Tokens for Programmatic Access
 */

export const colors = {
  ink: {
    DEFAULT: "#0f172a",
    muted: "#475569",
    subtle: "#94a3b8",
  },
  brand: {
    700: "#075985",
    800: "#0c4a6e",
    900: "#082f49",
  },
  accent: {
    DEFAULT: "#be123c",
    hover: "#9f1239",
  },
  teal: {
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
  },
  cyan: {
    500: "#06b6d4",
  },
  surface: {
    DEFAULT: "#f8fafc",
    raised: "#ffffff",
    muted: "#f1f5f9",
    glass: "rgba(255, 255, 255, 0.75)",
    glassDark: "rgba(15, 23, 42, 0.75)",
  },
  border: {
    DEFAULT: "#e2e8f0",
    subtle: "#cbd5e1",
    accent: "rgba(13, 148, 136, 0.3)",
  },
};

export const radii = {
  sm: "0.375rem",
  md: "0.75rem",
  card: "1rem",
  bento: "1.5rem",
  full: "9999px",
};

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  card: "0 10px 30px -5px rgb(15 23 42 / 0.05), 0 4px 6px -2px rgb(15 23 42 / 0.03)",
  bento: "0 20px 40px -10px rgb(15 23 42 / 0.07)",
  glow: "0 0 25px rgba(13, 148, 136, 0.2)",
};

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};
