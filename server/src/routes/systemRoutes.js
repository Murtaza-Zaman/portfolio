import { Router } from "express";
import mongoose from "mongoose";

import { env } from "../config/env.js";
import { Project, Service } from "../models/index.js";

export const systemRouter = Router();

const publishedFilter = {
  status: "published",
  publishedAt: { $lte: new Date() },
};

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function formatDate(date) {
  if (!date) return new Date().toISOString().split("T")[0];
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

systemRouter.get("/health", (_request, response) => {
  response.json({
    data: {
      status: "ok",
      environment: env.nodeEnv,
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    },
  });
});

systemRouter.get("/navigation", (_request, response) => {
  response.json({
    data: [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Services", path: "/services" },
      { label: "Projects", path: "/projects" },
      { label: "Resume", path: "/resume" },
      { label: "Contact", path: "/contact" },
    ],
  });
});

systemRouter.get("/sitemap.xml", async (_request, response, next) => {
  try {
    let services = [];
    let projects = [];

    if (mongoose.connection.readyState === 1) {
      [services, projects] = await Promise.all([
        Service.find(publishedFilter).select("slug updatedAt publishedAt").lean(),
        Project.find(publishedFilter).select("slug updatedAt publishedAt").lean(),
      ]);
    }

    const staticRoutes = [
      { path: "/", priority: "1.0", changefreq: "daily" },
      { path: "/about", priority: "0.9", changefreq: "weekly" },
      { path: "/services", priority: "0.9", changefreq: "weekly" },
      { path: "/projects", priority: "0.9", changefreq: "weekly" },
      { path: "/resume", priority: "0.7", changefreq: "monthly" },
      { path: "/contact", priority: "0.8", changefreq: "monthly" },
    ];

    const today = formatDate(new Date());

    const staticEntries = staticRoutes.map((route) => {
      const loc = `${env.publicSiteUrl}${route.path}`;
      return `<url><loc>${escapeXml(loc)}</loc><lastmod>${today}</lastmod><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`;
    });

    const dynamicEntries = [
      ...services.map((item) => ({
        path: `/services/${item.slug}`,
        lastmod: formatDate(item.updatedAt || item.publishedAt),
        priority: "0.8",
        changefreq: "weekly",
      })),
      ...projects.map((item) => ({
        path: `/projects/${item.slug}`,
        lastmod: formatDate(item.updatedAt || item.publishedAt),
        priority: "0.8",
        changefreq: "weekly",
      })),
    ].map((item) => {
      const loc = `${env.publicSiteUrl}${item.path}`;
      return `<url><loc>${escapeXml(loc)}</loc><lastmod>${item.lastmod}</lastmod><changefreq>${item.changefreq}</changefreq><priority>${item.priority}</priority></url>`;
    });

    const allUrls = [...staticEntries, ...dynamicEntries].join("");

    response
      .type("application/xml")
      .send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allUrls}</urlset>`);
  } catch (error) {
    next(error);
  }
});

systemRouter.get("/robots.txt", (_request, response) => {
  const robotsTxt = `# Robots.txt for Murtaza Zaman Portfolio Platform
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/v1/admin/
Disallow: /api/v1/auth/

# Search & Discovery Crawlers
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${env.publicSiteUrl}/sitemap.xml
`;
  response.type("text/plain").send(robotsTxt);
});

systemRouter.get("/llms.txt", (_request, response) => {
  const llmsTxt = `# Murtaza Zaman - Professional Knowledge & Portfolio Manifest

> Future Technology Builder & Software Engineer with 5+ years of experience specializing in full-stack web engineering, scalable SaaS platform architecture, cloud systems, and search engine optimization.

## Canonical Identity & Positioning
- Name: Murtaza Zaman
- Professional Title: Future Technology Builder & Software Engineer
- Canonical URL: ${env.publicSiteUrl}
- Primary Specializations: Web Application Development, SaaS Engineering, Cloud & Backend Architecture, Technical SEO Architecture, Scalable Database Systems.

## Core Services & Solutions
- Full-Stack Web Development: Production-grade React and Node.js web applications with modern design systems and REST APIs.
- Cloud & Backend Architecture: Microservices, RESTful APIs, distributed database caching, and robust security.
- SaaS & Cloud Architecture: Multi-tenant database design, JWT authentication, RBAC authorization, and resilient services.
- Technical SEO & Discovery: Schema.org JSON-LD structured data, OpenGraph, and Core Web Vitals optimization.

## Key Public URLs & Resources
- About & Profile: ${env.publicSiteUrl}/about
- Services Catalog: ${env.publicSiteUrl}/services
- Featured Projects: ${env.publicSiteUrl}/projects
- Professional Resume: ${env.publicSiteUrl}/resume
- Direct Contact: ${env.publicSiteUrl}/contact
`;
  response.type("text/plain; charset=utf-8").send(llmsTxt);
});
