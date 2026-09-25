import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";
import {
  AdminUser,
  Document,
  Profile,
  Project,
  Service,
  Settings,
  ShowcaseCard,
  TechNode,
} from "../models/index.js";

async function seed() {
  console.log("Connecting to database for seeding...");
  await connectDatabase();

  // 1. Seed Admin User
  const adminEmail = "admin@murtazazaman.com";
  let admin = await AdminUser.findOne({ email: adminEmail });
  if (!admin) {
    const passwordHash = await bcrypt.hash("admin123456", 10);
    admin = await AdminUser.create({
      email: adminEmail,
      passwordHash,
      displayName: "Murtaza Zaman",
      role: "admin",
      status: "active",
    });
    console.log("Created initial Admin User: admin@murtazazaman.com / admin123456");
  } else {
    console.log("Admin user already exists.");
  }

  // 2. Seed Settings
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      siteName: "Murtaza Zaman",
      siteTitle: "Future Technology Builder & Software Engineer",
      siteDescription:
        "Professional portfolio and digital solution engineering platform at the intersection of software development, cloud systems architecture, and digital growth.",
      contactEmail: "contact@murtazazaman.com",
      calendlyUrl: "https://calendly.com/murtazazaman",
      maintenanceMode: false,
    });
    console.log("Created default settings.");
  }

  // 3. Seed Profile
  let profile = await Profile.findOne({ slug: "murtaza-zaman" });
  if (!profile) {
    profile = await Profile.create({
      name: "Murtaza Zaman",
      title: "Future Technology Builder",
      slug: "murtaza-zaman",
      summary:
        "Full-stack software engineer and cloud systems architect building scalable web applications, SaaS platforms, and distributed digital systems.",
      experienceYears: 5,
      identityStatement:
        "I build software systems that solve real problems, automate workflows, and create measurable business value.",
      purposeStatement:
        "Connecting rigorous software engineering discipline with scalable cloud architecture and modern search discoverability.",
      technologyPerspective:
        "Modern technology should create clarity and leverage. Engineering choices are made based on reliability, performance, and user outcome.",
      approach:
        "Understand the core business challenge, design the right system architecture, build with precision, and deliver maintainable software.",
      professionalValues: [
        "Engineering Discipline",
        "Clear & Honest Communication",
        "Scalable Cloud Systems",
        "Maintainable Codebases",
      ],
      focusAreas: [
        "Full-Stack Web Development",
        "Cloud & Backend Architecture",
        "SaaS Product Engineering",
        "Search & Discovery Optimization",
      ],
      capabilityAreas: [
        "React & Vite Web Applications",
        "Node.js & Express REST APIs",
        "MongoDB & Relational Databases",
        "Cloud Infrastructure & Microservices",
      ],
      socialLinks: [
        { platform: "GitHub", label: "GitHub", url: "https://github.com/murtazazaman", color: "cyan" },
        { platform: "LinkedIn", label: "LinkedIn", url: "https://linkedin.com/in/murtazazaman", color: "sky" },
        { platform: "Twitter", label: "Twitter / X", url: "https://twitter.com/murtazazaman", color: "purple" },
        { platform: "WhatsApp", label: "WhatsApp", url: "https://wa.me/923369406373", color: "emerald" },
      ],
      badgeText: "Available for Projects",
      badgeActive: true,
      scriptTag: "Full-Stack Engineer",
      nameLine1: "MURTAZA",
      nameLine2: "ZAMAN",
      rolePrefix: "Future Technology Builder",
      roleSkills: [
        "Technical SEO Strategy",
        "AI Systems Integration",
        "Full-Stack Architecture",
        "Cloud Infrastructure",
      ],
      heroSkills: [
        "React / Next.js",
        "Node.js",
        "AI Integrations",
        "Cloud Arch",
        "Technical SEO",
      ],
      primaryCtaText: "Explore My Work",
      primaryCtaLink: "/projects",
      secondaryCtaText: "Start a Conversation",
      secondaryCtaLink: "/contact",
      philosophyEyebrow: "Professional Approach",
      philosophyHeading: "Technology should move a real problem forward.",
      philosophyDescription:
        "Understand the challenge, shape the right architecture, build with engineering discipline, and connect it to a measurable outcome.",
      philosophyLinkLabel: "Engineering background",
      philosophyLinkUrl: "/about",
      philosophySteps: [
        {
          n: "01",
          label: "Problem",
          desc: "Understand the business challenge, constraints, and what success actually looks like.",
        },
        {
          n: "02",
          label: "Architecture",
          desc: "Design the right system — not the most complex one. Trade-offs documented, options weighed.",
        },
        {
          n: "03",
          label: "Implementation",
          desc: "Build with engineering discipline. Clean code, tested, observable, deployable from day one.",
        },
        {
          n: "04",
          label: "Impact",
          desc: "Connect every technical decision back to a measurable business or user outcome.",
        },
      ],
      contactReferences: {
        email: "contact@murtazazaman.com",
        calendlyUrl: "https://calendly.com/murtazazaman",
      },
      status: "published",
      publishedAt: new Date(),
    });
    console.log("Created published Profile.");
  }

  // 4. Seed Services
  const servicesData = [
    {
      name: "Full-Stack Web Engineering",
      slug: "full-stack-web-engineering",
      category: "Web Application",
      summary:
        "Production-ready web applications built with React, Node.js, and modern database architectures designed for speed, security, and scale.",
      problem: "Organizations struggle with slow, unmaintainable web apps that fail to scale with user growth.",
      approach: "Modular component architecture, clean separation of concerns, and robust API design.",
      value: "High-performance digital products that load fast, convert visitors, and are easy to maintain.",
      capabilityArea: "Full-Stack Web",
      displayOrder: 1,
      status: "published",
      publishedAt: new Date(),
    },
    {
      name: "Cloud & Backend Architecture",
      slug: "cloud-and-backend-architecture",
      category: "Cloud Engineering",
      summary:
        "Resilient, highly-scalable backend services, microservices, and high-throughput REST APIs engineered for reliability and sub-millisecond database queries.",
      problem: "Monolithic systems and bottlenecked databases causing latency spikes and service outages.",
      approach: "Distributed caching, compound indexing, stateless JWT authentication, and automated rate limiting.",
      value: "Bulletproof infrastructure that guarantees 99.99% uptime under high traffic loads.",
      capabilityArea: "Cloud Engineering",
      displayOrder: 2,
      status: "published",
      publishedAt: new Date(),
    },
    {
      name: "SaaS Platform Architecture",
      slug: "saas-platform-architecture",
      category: "SaaS",
      summary:
        "End-to-end multi-tenant SaaS architecture including authentication, subscription management, and dashboard UX.",
      problem: "Complex SaaS state management and inefficient subscription workflows.",
      approach: "Role-based access control, reactive state management, and optimized database queries.",
      value: "Turnkey SaaS platforms ready to onboard paying subscribers from day one.",
      capabilityArea: "SaaS Development",
      displayOrder: 3,
      status: "published",
      publishedAt: new Date(),
    },
  ];

  for (const s of servicesData) {
    const existing = await Service.findOne({ slug: s.slug });
    if (!existing) {
      await Service.create(s);
      console.log(`Created Service: ${s.name}`);
    }
  }

  // 5. Seed Projects
  const projectsData = [
    {
      title: "High-Throughput Cloud Microservices Platform",
      slug: "high-throughput-cloud-microservices-platform",
      category: "Cloud Engineering",
      summary:
        "Distributed backend service mesh with Redis caching, MongoDB sharding, and automated load balancing.",
      challenge: "Legacy backend could not handle concurrent burst traffic exceeding 10,000 requests per second.",
      solution: "Engineered an asynchronous Node.js event-driven pipeline with connection pooling and caching layers.",
      outcome: "Handled 15,000+ req/sec with sub-25ms P99 latency and zero data drop.",
      technologies: ["Node.js", "Express", "MongoDB Atlas", "Redis", "Docker", "Tailwind CSS"],
      capabilityAreas: ["Cloud Engineering", "Full-Stack Web"],
      status: "published",
      publishedAt: new Date(),
    },
    {
      title: "Multi-Tenant Analytics SaaS",
      slug: "multi-tenant-analytics-saas",
      category: "SaaS",
      summary:
        "Real-time event tracking and business metrics dashboard with custom query builders and role-based permissions.",
      challenge: "High database latency on aggregate queries and unoptimized frontend re-renders.",
      solution: "Implemented compound MongoDB indexes, React Query caching, and modular bento dashboard components.",
      outcome: "Sub-50ms query response times and 99.9% uptime across production tenants.",
      technologies: ["React", "Express", "MongoDB Atlas", "Zustand", "Tailwind CSS", "Framer Motion"],
      capabilityAreas: ["SaaS Development", "Full-Stack Web"],
      status: "published",
      publishedAt: new Date(),
    },
    {
      title: "SEO-Driven Developer Platform",
      slug: "seo-driven-developer-platform",
      category: "Web Application",
      summary:
        "High-performance technical documentation and case study platform optimized for search discovery and search engines.",
      challenge: "Poor Core Web Vitals and lack of structured entity data in existing documentation portal.",
      solution: "Architected static prerendering, JSON-LD schema generation, and semantic HTML structure.",
      outcome: "Achieved 98+ Lighthouse scores across all Core Web Vitals metrics.",
      technologies: ["React 19", "Vite", "Express", "Tailwind CSS", "shadcn/ui", "JSON-LD"],
      capabilityAreas: ["Search & SEO", "Full-Stack Web"],
      status: "published",
      publishedAt: new Date(),
    },
  ];

  for (const p of projectsData) {
    const existing = await Project.findOne({ slug: p.slug });
    if (!existing) {
      await Project.create(p);
      console.log(`Created Project: ${p.title}`);
    }
  }

  // 6. Seed Resume Document
  let doc = await Document.findOne({ type: "resume" });
  if (!doc) {
    doc = await Document.create({
      title: "Murtaza Zaman - Technical Resume",
      type: "resume",
      description: "Official software engineering and cloud architecture resume.",
      secureUrl: "https://example.com/murtaza-zaman-resume.pdf",
      format: "pdf",
      visibility: "public",
      status: "published",
      publishedAt: new Date(),
    });
    console.log("Created Resume Document.");
  }

  // 7. Seed Showcase Cards (4 fixed cards for Engineering Intelligence System)
  const showcaseCardsData = [
    {
      displayOrder: 1,
      nodeLabel: "NODE 01 // TOPOLOGY",
      nodeTag: "",
      title: "Systems Engineered",
      description:
        "Production digital systems architected for resilience, low latency, and continuous scale.",
      items: [
        { label: "Web Applications", tag: "Next.js · React 19 · Sub-Second LCP", description: "" },
        { label: "SaaS Platforms", tag: "Multi-Tenant · RBAC · Stripe · MongoDB", description: "" },
        { label: "AI Systems", tag: "LLM Pipelines · RAG · Vector Retrieval", description: "" },
        { label: "Digital Products", tag: "End-to-End Delivery · CI/CD · Cloud Native", description: "" },
      ],
      status: "published",
      publishedAt: new Date(),
    },
    {
      displayOrder: 2,
      nodeLabel: "NODE 02 // PROGRESSION",
      nodeTag: "EVOLUTION PIPELINE",
      title: "Engineering Evolution",
      description:
        "From pixel-perfect client interfaces to resilient cloud backends and autonomous AI agents.",
      items: [
        { label: "Frontend Engineering", tag: "UI & INTERACTION", description: "Vercel aesthetics · 60fps micro-interactions · React 19" },
        { label: "Backend Architecture", tag: "SERVICES & DATA", description: "Node.js · Distributed APIs · High-throughput pipelines" },
        { label: "Cloud Systems", tag: "INFRASTRUCTURE", description: "Docker containerization · Redis caching · 99.9% Uptime" },
        { label: "Artificial Intelligence", tag: "INTELLIGENT SYSTEMS", description: "LLM agents · RAG pipelines · Autonomous workflows" },
      ],
      status: "published",
      publishedAt: new Date(),
    },
    {
      displayOrder: 3,
      nodeLabel: "NODE 03 // CONSTELLATION",
      nodeTag: "INTERACTIVE CLUSTER",
      title: "Technology Domains",
      description:
        "Hover a domain to inspect its architectural purpose and technical execution.",
      items: [
        { label: "AI", tag: "Intelligent Systems", description: "Autonomous AI agents, vector retrieval, embeddings, and context window optimization." },
        { label: "LLM", tag: "Language Models", description: "Tool usage, structured JSON output validation, and low-latency streaming responses." },
        { label: "React", tag: "Client Tier", description: "React 19, custom hook architectures, optimistic UI updates, and 60fps animations." },
        { label: "Next.js", tag: "Full-Stack Web", description: "Sub-second LCP, zero-bundle-size server logic, dynamic routing, and CDN caching." },
        { label: "Node.js", tag: "Backend Services", description: "Event-driven asynchronous processing, resilient error boundaries, and streaming I/O." },
        { label: "Cloud", tag: "Infrastructure", description: "Docker container workflows, Redis caching layers, microservices, and 99.9% SLAs." },
        { label: "Databases", tag: "Data Layer", description: "MongoDB Atlas indexing, aggregation pipelines, transaction atomicity, and query tuning." },
        { label: "SEO", tag: "Search Intelligence", description: "Schema.org JSON-LD, crawl optimization, dynamic sitemaps, and Core Web Vitals." },
      ],
      status: "published",
      publishedAt: new Date(),
    },
    {
      displayOrder: 4,
      nodeLabel: "NODE 04 // METHODOLOGY",
      nodeTag: "PROBLEM-SOLVING FRAMEWORK",
      title: "Architecture Mindset",
      description:
        "How I think and execute: from initial ambiguity to resilient, high-impact software systems.",
      items: [
        { label: "Problem", tag: "01", description: "Dissect core challenge, user friction, latency bottlenecks & scale goals." },
        { label: "Architecture", tag: "02", description: "Design data flow, API boundaries, state machines, and failover fallbacks." },
        { label: "Implementation", tag: "03", description: "Clean modular code, automated tests, atomic transactions & zero regressions." },
        { label: "Impact", tag: "04", description: "Sub-second speed, zero downtime, high user retention, and business growth." },
      ],
      status: "published",
      publishedAt: new Date(),
    },
  ];

  for (const card of showcaseCardsData) {
    const existing = await ShowcaseCard.findOne({ displayOrder: card.displayOrder });
    if (!existing) {
      await ShowcaseCard.create(card);
      console.log(`Created ShowcaseCard: ${card.title} (Order ${card.displayOrder})`);
    }
  }

  // 8. Seed 6 Interactive Node Graph Tech Nodes
  const techNodesData = [
    {
      displayOrder: 1,
      nodeId: "frontend",
      label: "Frontend Systems",
      abbr: "FE",
      category: "Client Architecture",
      color: "#22d3ee",
      glowColor: "rgba(34, 211, 238, 0.45)",
      bgGradient: "radial-gradient(circle at 35% 35%, rgba(34,211,238,0.25), rgba(6,182,212,0.06))",
      x: 820,
      y: 170,
      depth: 0.95,
      skills: ["React 19", "Next.js", "Tailwind CSS", "GSAP Animations"],
      desc: "Performant, accessible, motion-rich user interfaces and web applications.",
      status: "published",
      publishedAt: new Date(),
    },
    {
      displayOrder: 2,
      nodeId: "ai",
      label: "AI & LLM Systems",
      abbr: "AI",
      category: "Machine Intelligence",
      color: "#c084fc",
      glowColor: "rgba(192, 132, 252, 0.45)",
      bgGradient: "radial-gradient(circle at 35% 35%, rgba(192,132,252,0.25), rgba(168,85,247,0.06))",
      x: 180,
      y: 160,
      depth: 0.9,
      skills: ["Gemini API", "LangChain", "RAG Pipelines", "AI Agent Workflows"],
      desc: "Production-grade generative AI, reasoning agents, and semantic embeddings.",
      status: "published",
      publishedAt: new Date(),
    },
    {
      displayOrder: 3,
      nodeId: "backend",
      label: "Backend & APIs",
      abbr: "BE",
      category: "Server Engineering",
      color: "#38bdf8",
      glowColor: "rgba(56, 189, 248, 0.45)",
      bgGradient: "radial-gradient(circle at 35% 35%, rgba(56,189,248,0.25), rgba(14,165,233,0.06))",
      x: 800,
      y: 540,
      depth: 0.85,
      skills: ["Node.js", "Express", "REST APIs", "GraphQL"],
      desc: "Resilient microservices, high-throughput endpoints, and robust auth.",
      status: "published",
      publishedAt: new Date(),
    },
    {
      displayOrder: 4,
      nodeId: "data",
      label: "Data & Storage",
      abbr: "DB",
      category: "Persistence Layer",
      color: "#2dd4bf",
      glowColor: "rgba(45, 212, 191, 0.45)",
      bgGradient: "radial-gradient(circle at 35% 35%, rgba(45,212,191,0.25), rgba(20,184,166,0.06))",
      x: 200,
      y: 530,
      depth: 0.8,
      skills: ["PostgreSQL", "MongoDB Atlas", "Redis Cache", "Vector DB"],
      desc: "Relational, document, and vector databases optimized for scale and speed.",
      status: "published",
      publishedAt: new Date(),
    },
    {
      displayOrder: 5,
      nodeId: "cloud",
      label: "Cloud & DevOps",
      abbr: "CL",
      category: "Infrastructure",
      color: "#fbbf24",
      glowColor: "rgba(251, 191, 36, 0.45)",
      bgGradient: "radial-gradient(circle at 35% 35%, rgba(251,191,36,0.25), rgba(245,158,11,0.06))",
      x: 500,
      y: 90,
      depth: 0.75,
      skills: ["Docker", "Google Cloud", "CI/CD Pipelines", "Serverless"],
      desc: "Containerized environments, automated deployment, and scalable cloud ops.",
      status: "published",
      publishedAt: new Date(),
    },
    {
      displayOrder: 6,
      nodeId: "search",
      label: "Search & SEO",
      abbr: "SE",
      category: "Search Intelligence",
      color: "#34d399",
      glowColor: "rgba(52, 211, 153, 0.45)",
      bgGradient: "radial-gradient(circle at 35% 35%, rgba(52,211,153,0.25), rgba(16,185,129,0.06))",
      x: 500,
      y: 610,
      depth: 0.85,
      skills: ["Schema.org JSON-LD", "GEO / AEO", "Semantic Web", "Core Web Vitals"],
      desc: "Structured data and machine-readable manifests for next-gen search visibility.",
      status: "published",
      publishedAt: new Date(),
    },
  ];

  for (const node of techNodesData) {
    const existing = await TechNode.findOne({ displayOrder: node.displayOrder });
    if (!existing) {
      await TechNode.create(node);
      console.log(`Created TechNode: ${node.label} (${node.abbr}, Order ${node.displayOrder})`);
    }
  }

  console.log("Seeding completed successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
