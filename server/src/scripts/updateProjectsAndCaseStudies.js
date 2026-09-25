import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { Project } from "../models/index.js";

async function runUpdates() {
  console.log("Connecting to database...");
  await connectDatabase();

  // 1. Update Project 1: SEO-Driven Developer Platform
  await Project.findOneAndUpdate(
    { slug: "seo-driven-developer-platform" },
    {
      title: "SEO-Driven Developer Platform",
      category: "Developer Tool",
      summary: "High-performance technical documentation and showcase platform with static prerendering, JSON-LD schemas, and 98+ Core Web Vitals.",
      challenge: "Poor Core Web Vitals and lack of structured entity data in existing documentation portal.",
      solution: "Architected static prerendering, JSON-LD schema generation, and semantic HTML structure.",
      outcome: "Achieved 98+ Lighthouse scores across all Core Web Vitals metrics.",
      technologies: ["React 19", "Vite", "Express", "Tailwind CSS", "JSON-LD"],
      tags: ["Developer Tooling", "Search & Discovery"],
      status: "published",
    },
    { upsert: true }
  );
  console.log("Updated SEO-Driven Developer Platform");

  // 2. Update Project 2: Multi-Tenant Analytics SaaS
  await Project.findOneAndUpdate(
    { slug: "multi-tenant-analytics-saas" },
    {
      title: "Multi-Tenant Analytics SaaS",
      category: "Enterprise SaaS",
      summary: "Real-time event tracking and business metrics dashboard with custom query builders, compound MongoDB indexes, and RBAC security.",
      challenge: "High database latency on aggregate queries and unoptimized frontend re-renders.",
      solution: "Implemented compound MongoDB indexes, React Query caching, and modular bento dashboard components.",
      outcome: "Sub-50ms query response times and 99.9% uptime across production tenants.",
      technologies: ["React", "Express", "MongoDB Atlas", "Zustand", "Tailwind CSS"],
      tags: ["Enterprise SaaS", "Database Architecture"],
      status: "published",
    },
    { upsert: true }
  );
  console.log("Updated Multi-Tenant Analytics SaaS");

  // 3. Update Project 3: Enterprise AI Content Platform
  await Project.findOneAndUpdate(
    { slug: "enterprise-ai-content-platform" },
    {
      title: "Enterprise AI Content Platform",
      category: "AI Integration",
      summary: "Custom content orchestration system integrating Gemini API with structured review workflows for editorial teams.",
      challenge: "Editorial teams spent 15+ hours weekly reformatting and drafting metadata across distributed channels.",
      solution: "Engineered a React + Express workspace with Gemini assistant generating structured drafts with human sign-off.",
      outcome: "Reduced drafting turnaround by 65% with zero unverified automated publishing incidents.",
      technologies: ["React", "Vite", "Node.js", "Express", "Gemini API", "MongoDB"],
      tags: ["AI Integration", "Editorial Systems"],
      status: "published",
    },
    { upsert: true }
  );
  console.log("Updated Enterprise AI Content Platform");

  // 4. Update Project 4: E-Commerce Storefront (Fixing typo from "Ecommere Website")
  await Project.deleteMany({ slug: { $in: ["ecommere-website", "e-commerce-storefront"] } });
  await Project.create({
    title: "E-Commerce Storefront",
    slug: "e-commerce-storefront",
    category: "E-Commerce Platform",
    summary: "A responsive multi-category storefront with cart, checkout, and product filtering, built for sub-second performance on low-end mobile devices.",
    challenge: "Unoptimized product catalog rendering and slow cart state synchronization on mobile networks.",
    solution: "Implemented optimistic cart state management, dynamic code splitting, and responsive WebP image pipelines.",
    outcome: "Achieved sub-1s initial page load and seamless checkout experience across all mobile devices.",
    technologies: ["React", "Tailwind CSS", "Stripe", "Performance"],
    tags: ["E-Commerce Platform", "Design & Development"],
    status: "published",
    publishedAt: new Date(),
  });
  console.log("Created/Updated E-Commerce Storefront");

  console.log("Database update completed!");
  await mongoose.disconnect();
}

runUpdates().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
