import { ROUTES } from "./routes";

/**
 * Section 02: Website Strategy, Information Architecture & Ecosystem Specification
 * Defines the strategic structure, 6 core pages, 4 information levels, 2 user flows,
 * 3 CTA commitment tiers, 4 relational content entities, and growth roadmap.
 */

export const STRATEGIC_LAYERS = {
  IDENTITY: {
    level: 1,
    name: "Identity Layer",
    purpose: "Immediate professional recognition and value proposition understanding.",
    routes: [ROUTES.PUBLIC.HOME],
  },
  CAPABILITY: {
    level: 2,
    name: "Capability Layer",
    purpose: "Explain technical solutions, engineering abilities, and problem domains.",
    routes: [ROUTES.PUBLIC.SERVICES, ROUTES.PUBLIC.ABOUT],
  },
  PROOF: {
    level: 3,
    name: "Proof Layer",
    purpose: "Provide tangible evidence of engineering competence and business impact.",
    routes: [ROUTES.PUBLIC.PROJECTS],
  },
  ENGAGEMENT: {
    level: 4,
    name: "Engagement Layer",
    purpose: "Low-friction conversion channels for clients, recruiters, and collaborators.",
    routes: [ROUTES.PUBLIC.CONTACT, ROUTES.PUBLIC.RESUME],
  },
};

export const CORE_PAGES = [
  {
    id: "home",
    name: "Home Page",
    path: ROUTES.PUBLIC.HOME,
    purpose: "Primary introduction and conversion gateway; create immediate understanding.",
    visitorIntent: "Understand who Murtaza is, what he builds, and whether exploration is valuable.",
    requiredBlocks: [
      "Professional Introduction & Hero",
      "Engineering Philosophy & Capability Overview",
      "Featured Work Preview",
      "Professional Approach & Working Philosophy",
      "Engagement & Collaboration Invitation",
    ],
    nextAction: "Explore Projects or Services",
  },
  {
    id: "about",
    name: "About Page",
    path: ROUTES.PUBLIC.ABOUT,
    purpose: "Provide deeper professional context, engineering mindset, and working philosophy.",
    visitorIntent: "Understand the thinking, maturity, and perspective behind the engineer.",
    requiredBlocks: [
      "Professional Overview",
      "Technology Philosophy",
      "Experience Perspective & Career Milestones",
      "Professional Values & Approach",
      "Concrete Work Showcase Link",
    ],
    nextAction: "View Projects or Initiate Contact",
  },
  {
    id: "services",
    name: "Services Page",
    path: ROUTES.PUBLIC.SERVICES,
    purpose: "Help potential clients understand solution offerings organized by business outcomes.",
    visitorIntent: "Evaluate if Murtaza can solve their specific digital challenge.",
    requiredBlocks: [
      "Solution Overview",
      "Full-Stack Web Engineering",
      "Cloud & Backend Architecture",
      "SaaS Platform Architecture",
      "Technical SEO & Growth Engineering",
    ],
    nextAction: "Explore Related Projects or Contact",
  },
  {
    id: "projects",
    name: "Projects Page",
    path: ROUTES.PUBLIC.PROJECTS,
    purpose: "Demonstrate practical engineering capability with interactive filtering.",
    visitorIntent: "Review working evidence of modern software applications and systems.",
    requiredBlocks: [
      "Category Filter Tabs",
      "Search Input",
      "Project Grid with Summaries & Tech Stacks",
      "Individual Project Detail Routes",
    ],
    nextAction: "Initiate Project Collaboration",
  },
  {
    id: "resume",
    name: "Resume Page",
    path: ROUTES.PUBLIC.RESUME,
    purpose: "Structured evaluation document for technology recruiters and hiring managers.",
    visitorIntent: "Quickly assess experience, credentials, technology stack, and career progression.",
    requiredBlocks: [
      "Professional Summary",
      "Core Capability Matrix",
      "Detailed Career Experience",
      "Verified Technical Skills",
      "Downloadable PDF Resume Action",
    ],
    nextAction: "Initiate Direct Contact",
  },
  {
    id: "contact",
    name: "Contact Page",
    path: ROUTES.PUBLIC.CONTACT,
    purpose: "Convert visitor interest into structured professional inquiries and project opportunities.",
    visitorIntent: "Propose a project, discuss a role, or request technical consultation.",
    requiredBlocks: [
      "Interactive Inquiry Form",
      "Audience-Specific Purpose Selector",
      "Direct Email & LinkedIn Links",
      "Response SLA & Professional Expectations",
    ],
    nextAction: "Form Submission Confirmation",
  },
];

export const TECHNICAL_SPECIFICATIONS = {
  frontend: {
    framework: "React 19 with Vite",
    styling: "Tailwind CSS + CSS Modules for specialized components",
    icons: "Lucide React (optimized SVG tree-shaking)",
    stateManagement: "Zustand (client-side) + TanStack React Query (server-state)",
    forms: "React Hook Form + Zod schema validation",
    routing: "React Router with route-based code splitting",
  },
  backend: {
    runtime: "Node.js with Express",
    database: "MongoDB with Mongoose ORM",
    caching: "Redis (distributed cache) + In-Memory Fallbacks",
    authentication: "Stateless JWT with HTTP-only cookie refresh rotation",
    security: "Helmet, CORS whitelist, Rate limiting, Input sanitization",
  },
  infrastructure: {
    frontendHosting: "Vercel / Cloudflare Pages",
    backendHosting: "Render / AWS ECS",
    databaseCluster: "MongoDB Atlas (Multi-region replica set)",
    cdn: "Cloudflare Global Edge Network",
    mediaStorage: "Cloudinary (automatic optimization and WebP delivery)",
  },
};

export const USER_JOURNEYS = {
  CLIENT_PATH: {
    audience: "International Clients",
    stages: ["Awareness", "Capability Evaluation", "Proof Discovery", "Trust Confirmation", "Engagement"],
    sequence: [
      ROUTES.PUBLIC.HOME,
      ROUTES.PUBLIC.SERVICES,
      ROUTES.PUBLIC.PROJECTS,
      ROUTES.PUBLIC.CONTACT,
    ],
  },
  RECRUITER_PATH: {
    audience: "Technology Recruiters & Engineering Leaders",
    stages: ["Profile Understanding", "Mindset Review", "Capability Review", "Document Qualification", "Connection"],
    sequence: [
      ROUTES.PUBLIC.HOME,
      ROUTES.PUBLIC.ABOUT,
      ROUTES.PUBLIC.PROJECTS,
      ROUTES.PUBLIC.RESUME,
      ROUTES.PUBLIC.CONTACT,
    ],
  },
};

export const CTA_COMMITMENT_TIERS = {
  LOW: {
    tier: "Low Commitment",
    targetAudience: "Early visitors & exploratory browsers",
    examples: [
      "Explore Selected Work",
      "View All Services",
    ],
  },
  MEDIUM: {
    tier: "Medium Commitment",
    targetAudience: "Engaged visitors evaluating fit",
    examples: [
      "Explore Engineering Background",
      "Open Technical Resume",
    ],
  },
  HIGH: {
    tier: "High Commitment",
    targetAudience: "Qualified clients & recruiters ready to converse",
    examples: [
      "Initiate Collaboration",
      "Let's discuss your project",
      "Start a conversation",
    ],
  },
};

export const CONTENT_ENTITY_GRAPH = {
  entities: [
    {
      name: "Profile",
      purpose: "Central professional identity.",
      connectsTo: ["Services", "Projects", "Resume", "Contact"],
    },
    {
      name: "Service",
      purpose: "Solution offerings organized by business outcomes.",
      connectsTo: ["Projects", "Contact"],
    },
    {
      name: "Project",
      purpose: "Showcase of completed software engineering work.",
      connectsTo: ["Services", "Technologies"],
    },
    {
      name: "Technology",
      purpose: "Technical tools, frameworks, and architecture components.",
      connectsTo: ["Projects", "Services"],
    },
  ],
};

export const GROWTH_ROADMAP = [
  {
    phase: 1,
    name: "Professional Portfolio Foundation",
    status: "Active",
    focus: "Establish credibility, showcase projects, and attract initial international clients.",
  },
  {
    phase: 2,
    name: "Technology Professional Platform",
    status: "Upcoming",
    focus: "Expand technology solutions, offer downloadable architectural guides, and grow reach.",
  },
  {
    phase: 3,
    name: "Technology Business & SaaS Ecosystem",
    status: "Planned",
    focus: "Launch independent SaaS products, developer workflow tools, and scalable software platforms.",
  },
  {
    phase: 4,
    name: "Full Technology Ecosystem",
    status: "Vision",
    focus: "Comprehensive tech consulting, multi-product SaaS ecosystem, and high-performance solutions suite.",
  },
];
