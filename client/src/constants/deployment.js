/**
 * SECTION 10: DEPLOYMENT & PRODUCTION SPECIFICATIONS (CLIENT)
 * Murtaza Zaman Professional Technology Portfolio Platform
 */

export const CLIENT_DEPLOYMENT_CONFIG = {
  platform: "Vercel",
  framework: "React 19 + Vite",
  buildCommand: "npm run build",
  outputDirectory: "dist",
  environmentVariables: {
    apiUrl: "VITE_API_URL",
    publicSiteUrl: "VITE_PUBLIC_SITE_URL",
  },
  spaRouting: {
    fallback: "/index.html",
    preserveHistory: true,
  },
  productionChecklist: [
    "Clean production build with zero TypeScript and zero ESLint errors/warnings",
    "SPA fallback configuration active for React Router routes",
    "Dynamic SEO tags and JSON-LD schema injection enabled",
    "Cloudinary automatic responsive transformations active",
    "JWT access token handled securely in session",
    "Core Web Vitals optimized for Lighthouse 95+ target",
    "Reduced motion fallback compliance for accessibility",
  ],
  sentry: {
    enabled: Boolean(import.meta.env.VITE_SENTRY_DSN),
    dsn: import.meta.env.VITE_SENTRY_DSN || "",
  },
};
