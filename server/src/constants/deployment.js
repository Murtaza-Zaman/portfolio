/**
 * SECTION 10: DEPLOYMENT, DEVOPS, SECURITY & PRODUCTION ARCHITECTURE
 * Murtaza Zaman Professional Technology Portfolio Platform
 */

export const DEPLOYMENT_CONFIG = {
  frontend: {
    platform: "Vercel",
    repository: "portfolio-frontend",
    buildCommand: "npm run build",
    outputDir: "dist",
    environmentVariables: ["VITE_API_URL", "VITE_PUBLIC_SITE_URL"],
    spaRoutingFallback: true,
  },
  backend: {
    platform: "Render Professional",
    repository: "portfolio-backend",
    startCommand: "npm start",
    devCommand: "npm run dev",
    healthCheckEndpoint: "/api/health",
    port: 4000,
    requiredEnvVars: [
      "PORT",
      "NODE_ENV",
      "MONGO_URI",
      "CLIENT_ORIGIN",
      "JWT_SECRET",
      "REFRESH_TOKEN_SECRET",
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ],
  },
  database: {
    provider: "MongoDB Atlas",
    tier: "Single Production Database",
    collections: [
      "users",
      "projects",
      "case-studies",
      "blogs",
      "services",
      "skills",
      "technologies",
      "testimonials",
      "experiences",
      "educations",
      "inquiries",
      "seo-metadata",
      "media-library",
      "site-settings",
    ],
    primaryIndexes: ["slug", "email", "createdAt", "status", "category"],
  },
  media: {
    provider: "Cloudinary",
    folders: {
      projects: "portfolio/projects",
      blogs: "portfolio/blogs",
      profile: "portfolio/profile",
      uploads: "portfolio/uploads",
    },
    allowedFormats: ["jpg", "png", "webp", "svg"],
    optimizations: ["f_auto", "q_auto"],
  },
  security: {
    authentication: "JWT (JsonWebToken) + bcrypt password hashing",
    tokenExpiry: "1h access token, 7d refresh token",
    cors: "Strict origin whitelisting in production",
    rateLimits: {
      auth: "20 attempts / 15 min",
      inquiries: "10 submissions / 15 min",
      publicApi: "100 requests / 15 min",
    },
    middleware: ["helmet", "cors", "express-rate-limit", "zod validation", "express.json(2mb)"],
  },
  monitoring: {
    logger: "Winston (levels: error, warn, info, debug)",
    errorTracking: "Sentry",
    healthCheck: "GET /api/health",
  },
  scalabilityRoadmap: [
    { phase: 1, name: "Portfolio Platform", focus: "Personal branding, public showcases, cloud systems architecture" },
    { phase: 2, name: "Advanced CMS", focus: "Automated media pipelines, full SEO audit suite, content scheduler" },
    { phase: 3, name: "Client Portal", focus: "Client onboarding, proposal reviews, project milestone tracking" },
    { phase: 4, name: "SaaS Platform", focus: "Multi-tenant architecture, automated consulting reports, performance tool suite" },
  ],
};
