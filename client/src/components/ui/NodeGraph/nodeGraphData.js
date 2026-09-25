/**
 * Node Graph Data Definition
 *
 * 6 Skill Nodes radiating around a central core nucleus in a 1000x700 viewBox coordinate space.
 * Each node has full metadata: id, label, category, abbreviation, skills, coordinates, colors, and depth.
 */

export const DEFAULT_GRAPH_CENTER = { x: 500, y: 350 };

export const DEFAULT_GRAPH_NODES = [
  {
    id: "frontend",
    label: "Frontend Systems",
    abbr: "FE",
    category: "Client Architecture",
    color: "#22d3ee", // Cyan
    glowColor: "rgba(34, 211, 238, 0.45)",
    bgGradient: "radial-gradient(circle at 35% 35%, rgba(34,211,238,0.25), rgba(6,182,212,0.06))",
    x: 820,
    y: 170,
    depth: 0.95, // For 3D parallax & layer weighting
    skills: ["React 19", "Next.js", "Tailwind CSS", "GSAP Animations"],
    desc: "Performant, accessible, motion-rich user interfaces and web applications.",
  },
  {
    id: "ai",
    label: "AI & LLM Systems",
    abbr: "AI",
    category: "Machine Intelligence",
    color: "#c084fc", // Purple / Violet
    glowColor: "rgba(192, 132, 252, 0.45)",
    bgGradient: "radial-gradient(circle at 35% 35%, rgba(192,132,252,0.25), rgba(168,85,247,0.06))",
    x: 180,
    y: 160,
    depth: 0.9,
    skills: ["Gemini API", "LangChain", "RAG Pipelines", "AI Agent Workflows"],
    desc: "Production-grade generative AI, reasoning agents, and semantic embeddings.",
  },
  {
    id: "backend",
    label: "Backend & APIs",
    abbr: "BE",
    category: "Server Engineering",
    color: "#38bdf8", // Sky Blue
    glowColor: "rgba(56, 189, 248, 0.45)",
    bgGradient: "radial-gradient(circle at 35% 35%, rgba(56,189,248,0.25), rgba(14,165,233,0.06))",
    x: 800,
    y: 540,
    depth: 0.85,
    skills: ["Node.js", "Express", "REST APIs", "GraphQL"],
    desc: "Resilient microservices, high-throughput endpoints, and robust auth.",
  },
  {
    id: "data",
    label: "Data & Storage",
    abbr: "DB",
    category: "Persistence Layer",
    color: "#2dd4bf", // Teal
    glowColor: "rgba(45, 212, 191, 0.45)",
    bgGradient: "radial-gradient(circle at 35% 35%, rgba(45,212,191,0.25), rgba(20,184,166,0.06))",
    x: 200,
    y: 530,
    depth: 0.8,
    skills: ["PostgreSQL", "MongoDB Atlas", "Redis Cache", "Vector DB"],
    desc: "Relational, document, and vector databases optimized for scale and speed.",
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    abbr: "CL",
    category: "Infrastructure",
    color: "#fbbf24", // Amber
    glowColor: "rgba(251, 191, 36, 0.45)",
    bgGradient: "radial-gradient(circle at 35% 35%, rgba(251,191,36,0.25), rgba(245,158,11,0.06))",
    x: 500,
    y: 90,
    depth: 0.75,
    skills: ["Docker", "Google Cloud", "CI/CD Pipelines", "Serverless"],
    desc: "Containerized environments, automated deployment, and scalable cloud ops.",
  },
  {
    id: "search",
    label: "Search & SEO",
    abbr: "SE",
    category: "Search Intelligence",
    color: "#34d399", // Emerald
    glowColor: "rgba(52, 211, 153, 0.45)",
    bgGradient: "radial-gradient(circle at 35% 35%, rgba(52,211,153,0.25), rgba(16,185,129,0.06))",
    x: 500,
    y: 610,
    depth: 0.85,
    skills: ["Schema.org JSON-LD", "GEO / AEO", "Semantic Web", "Core Web Vitals"],
    desc: "Structured data and machine-readable manifests for next-gen search visibility.",
  },
];
