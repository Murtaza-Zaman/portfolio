/**
 * SECTION 04: FRONTEND ENGINEERING & ARCHITECTURE SPECIFICATIONS
 * Murtaza Zaman Professional Technology Portfolio Platform
 *
 * Defines the complete architectural model, layer structure, component hierarchy,
 * state separation, responsive standards, performance thresholds, and security rules.
 */

export const FRONTEND_STACK = {
  framework: "React 19",
  buildTool: "Vite",
  language: "JavaScript ES6+",
  styling: "Tailwind CSS + Custom CSS Properties",
  uiSystem: "shadcn/ui inspired primitives",
  clientState: "Zustand",
  serverState: "TanStack React Query",
  forms: "React Hook Form",
  validation: "Zod",
  routing: "React Router",
  animation: "Framer Motion",
  targetPerformance: "Lighthouse 95+",
};

export const APPLICATION_LAYERS = {
  LAYER_01_APP_CORE: {
    id: "app",
    path: "src/app",
    purpose: "Application initialization, providers, global configuration, router mounting",
    hasBusinessLogic: false,
  },
  LAYER_02_ROUTING: {
    id: "routes",
    path: "src/routes",
    purpose: "Route definitions, public/admin route separation, protected route wrappers",
  },
  LAYER_03_FEATURES: {
    id: "features",
    path: "src/features",
    purpose: "Business capability modules (auth, home, about, services, projects, contact, admin, settings)",
  },
  LAYER_04_SHARED_COMPONENTS: {
    id: "components",
    path: "src/components",
    purpose: "Reusable design system primitives (ui), shared components (common), layouts (layout), feedback",
  },
  LAYER_05_ADMIN_DASHBOARD: {
    id: "admin",
    path: "src/features/admin",
    purpose: "Integrated CMS dashboard, CRUD managers, settings, inquiry viewer",
  },
  LAYER_06_API_SERVICES: {
    id: "services",
    path: "src/services",
    purpose: "HTTP client abstraction, API endpoints communication (apiClient, authApi, publicApi, adminApi)",
  },
  LAYER_07_CUSTOM_HOOKS: {
    id: "hooks",
    path: "src/hooks",
    purpose: "Reusable stateful UI & data hooks (useAuth, useDebounce, useModal, usePagination, usePublicContent)",
  },
  LAYER_08_STATE_MANAGEMENT: {
    id: "store",
    path: "src/store",
    purpose: "Global client-only state via Zustand (authStore, uiStore, adminStore)",
  },
  LAYER_09_SCHEMA_VALIDATION: {
    id: "schemas",
    path: "src/schemas",
    purpose: "Zod schema definitions for forms, auth, admin CRUD, and query validation",
  },
  LAYER_10_UTILITIES: {
    id: "utils",
    path: "src/utils",
    purpose: "Generic helper functions (formatters, brandValidator, seoSchemas, slugGenerator, imageOptimizer)",
  },
};

export const COMPONENT_HIERARCHY = {
  LEVEL_01_FOUNDATION: {
    level: 1,
    name: "Foundation UI Elements",
    location: "src/components/ui",
    examples: ["Button", "Input", "Badge", "Card", "Modal", "Select", "Tabs", "Skeleton"],
    source: "shadcn/ui inspired",
  },
  LEVEL_02_SHARED: {
    level: 2,
    name: "Shared Components",
    location: "src/components/common",
    examples: ["SiteHeader", "SiteFooter", "ContentCard", "ContentState", "DetailPage", "Seo", "AppErrorBoundary"],
  },
  LEVEL_03_LAYOUT: {
    level: 3,
    name: "Layout Structures",
    location: "src/layouts",
    examples: ["PublicLayout", "AdminLayout"],
  },
  LEVEL_04_FEATURE: {
    level: 4,
    name: "Feature Components",
    location: "src/features/[feature]/components",
    examples: ["ProjectCard", "AdminResourcePage", "InquiriesManager", "MediaManager", "WhatsAppButton"],
  },
  LEVEL_05_PAGE: {
    level: 5,
    name: "Page Components",
    location: "src/features/[feature]/pages",
    examples: ["HomePage", "ProjectsPage", "AboutPage", "ServicesPage", "AdminDashboard"],
  },
};

export const STATE_TIERS = {
  LOCAL_UI: {
    tool: "React useState / useReducer",
    purpose: "Component-scoped temporary UI interactions (e.g. dropdown open, modal open, local toggle)",
  },
  GLOBAL_CLIENT: {
    tool: "Zustand",
    purpose: "Global application state (auth session, UI preferences, admin sidebar state, reduced motion)",
    rule: "Never store raw API responses or database caches here",
  },
  SERVER_STATE: {
    tool: "TanStack React Query",
    purpose: "Server state, API fetching, caching, deduplication, optimistic updates, and mutation invalidation",
    rule: "Components never call fetch/axios directly; always consume via React Query hooks and service layer",
  },
};

export const RESPONSIVE_BREAKPOINTS = {
  sm: { minWidth: 640, description: "Mobile landscape & small tablets" },
  md: { minWidth: 768, description: "Tablets & portrait iPads" },
  lg: { minWidth: 1024, description: "Laptops & standard desktops" },
  xl: { minWidth: 1280, description: "Large desktop screens" },
  "2xl": { minWidth: 1536, description: "Ultra-wide displays" },
  minTouchTargetPx: 44,
  strategy: "Mobile-First",
};

export const PERFORMANCE_TARGETS = {
  lighthouseScore: 95,
  coreWebVitals: {
    lcpSecondsMax: 2.5,
    clsScoreMax: 0.1,
    inpMsMax: 200,
  },
  strategies: [
    "Route-based code splitting using React.lazy",
    "On-demand feature loading",
    "Cloudinary automatic format (f_auto) and quality (q_auto) image transformations",
    "Debounced search and filter inputs",
    "Optimized SVG iconography without heavy font-icon bundles",
  ],
};

export const MOTION_LEVELS = {
  LEVEL_01_GLOBAL: {
    level: 1,
    name: "Global Motion",
    description: "Page transitions, route changes, global loading bar/skeletons",
    durationMs: 300,
  },
  LEVEL_02_SECTION: {
    level: 2,
    name: "Section Motion",
    description: "Hero entrance, viewport scroll reveals, bento card appearances",
    durationMs: 450,
  },
  LEVEL_03_MICRO: {
    level: 3,
    name: "Micro Interactions",
    description: "Button hover, active press states, badge highlights, form focus indicators",
    durationMs: 150,
  },
  rules: [
    "Use GPU-accelerated properties: transform, opacity, scale",
    "Avoid animating layout-shifting properties: width, height, top, left",
    "Strictly honor prefers-reduced-motion media query",
  ],
};

export const SECURITY_STANDARDS = {
  authType: "JWT Authentication with secure session storage",
  roles: ["ADMIN", "EDITOR", "CONTENT_MANAGER"],
  permissions: {
    ADMIN: { canView: true, canEdit: true, canDelete: true, canManageUsers: true, canConfigureSeo: true },
    EDITOR: { canView: true, canEdit: true, canDelete: false, canManageUsers: false, canConfigureSeo: true },
    CONTENT_MANAGER: { canView: true, canEdit: true, canDelete: false, canManageUsers: false, canConfigureSeo: false },
  },
  guidelines: [
    "Never trust client-side validation alone; backend is the authoritative security boundary",
    "Validate all user input with Zod schemas and React Hook Form",
    "Sanitize rich text content before rendering to prevent XSS attacks",
    "Never expose backend secrets or private API keys in client environment variables",
    "Public client variables must use VITE_ prefix with only public values",
  ],
};

export const ADMIN_CMS_ENTITIES = [
  "projects",
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
  "admin-users",
];

export const PRODUCTION_CHECKLIST = [
  "Zero TypeScript in client (100% JavaScript ES6+)",
  "Zero ESLint errors and warnings",
  "Feature-based modular organization with clean @/ aliases",
  "Separation of presentation and business logic",
  "All forms guarded by React Hook Form + Zod validation",
  "Mobile-first responsive design across sm/md/lg/xl breakpoints",
  "Touch targets >= 44px on mobile",
  "Core Web Vitals optimized (LCP, CLS, INP) for Lighthouse 95+",
  "Smooth Framer Motion interactions with reduced motion fallback",
  "Protected admin routes with JWT session verification",
  "Clean production build with route-based code splitting",
];
