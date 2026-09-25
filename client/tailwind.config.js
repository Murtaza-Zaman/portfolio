/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Deep navy brand palette
        navy: {
          950: "#050c1a",
          900: "#0a0f1e",
          850: "#0d1526",
          800: "#111827",
          700: "#1a2540",
          600: "#243050",
        },
        // Cyan accent (primary interactive color)
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
        // Coral / rose accent (category, eyebrow, highlight)
        coral: {
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
        },
        // Teal (secondary interactive)
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
      },
      borderRadius: {
        card: "1rem",
        bento: "1.5rem",
        xl2: "1.25rem",
      },
      boxShadow: {
        // Light surface shadows
        card: "0 1px 3px 0 rgb(15 23 42 / 0.04), 0 4px 16px -4px rgb(15 23 42 / 0.08)",
        "card-hover": "0 8px 32px -8px rgb(15 23 42 / 0.18), 0 2px 8px -2px rgb(15 23 42 / 0.06)",
        bento: "0 20px 40px -10px rgb(15 23 42 / 0.07)",
        // Glow shadows for dark surfaces
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.25), 0 0 60px rgba(6, 182, 212, 0.1)",
        "glow-cyan-lg": "0 0 40px rgba(6, 182, 212, 0.35), 0 0 100px rgba(6, 182, 212, 0.15)",
        "glow-red": "0 0 20px rgba(244, 63, 94, 0.2)",
        // Glass surface shadow
        glass: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        "glass-sm": "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.1)",
      },
      fontFamily: {
        display: ["Geist", "Inter", "system-ui", "sans-serif"],
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "Consolas", "monospace"],
        editorial: ["'League Gothic'", "Impact", "'Arial Narrow'", "sans-serif"],
        script: ["'Caveat'", "cursive"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
      },
      letterSpacing: {
        tightest: "-0.05em",
        tighter: "-0.03em",
        brand: "0.18em",
        wide2: "0.22em",
      },
      backgroundImage: {
        // Subtle dot grid for dark sections
        "grid-navy": "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "grid-light": "radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)",
        // Gradient meshes
        "hero-mesh":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(6,182,212,0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(244,63,94,0.08) 0%, transparent 50%)",
        "cta-mesh":
          "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(6,182,212,0.2) 0%, transparent 60%)",
        // Glass gradient
        "glass-surface": "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
      keyframes: {
        // Ambient glow pulse
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        // Availability indicator
        "ping-slow": {
          "75%, 100%": { transform: "scale(1.8)", opacity: "0" },
        },
        // Data flow along lines
        "dash-flow": {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
        // Shimmer on glass surfaces
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        // Float for hero nodes
        "float-y": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float-y-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        // Terminal cursor
        termBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        // Fade in up
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "dash-flow": "dash-flow 2s linear infinite",
        shimmer: "shimmer 3s linear infinite",
        "float-y": "float-y 4s ease-in-out infinite",
        "float-y-slow": "float-y-slow 6s ease-in-out infinite",
        "term-blink": "termBlink 1s step-end infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    },
  },
  plugins: [],
};
