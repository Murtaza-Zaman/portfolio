import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { env } from "../src/config/env.js";

describe("Backend SEO, GEO & AEO Discovery Endpoints", () => {
  describe("Sitemap Generation (/sitemap.xml)", () => {
    it("returns valid XML sitemap with XML headers and namespace", async () => {
      const res = await request(app).get("/sitemap.xml");
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toContain("xml");
      expect(res.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(res.text).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    });

    it("includes required static routes with priority, changefreq, and lastmod tags", async () => {
      const res = await request(app).get("/api/v1/sitemap.xml");
      expect(res.status).toBe(200);

      // Verify presence of all key routes
      expect(res.text).toContain(`<loc>${env.publicSiteUrl}/</loc>`);
      expect(res.text).toContain(`<loc>${env.publicSiteUrl}/about</loc>`);
      expect(res.text).toContain(`<loc>${env.publicSiteUrl}/services</loc>`);
      expect(res.text).toContain(`<loc>${env.publicSiteUrl}/projects</loc>`);
      expect(res.text).toContain(`<loc>${env.publicSiteUrl}/resume</loc>`);
      expect(res.text).toContain(`<loc>${env.publicSiteUrl}/contact</loc>`);

      // Verify metadata tags
      expect(res.text).toContain("<lastmod>");
      expect(res.text).toContain("<changefreq>daily</changefreq>");
      expect(res.text).toContain("<priority>1.0</priority>");
    });
  });

  describe("Robots.txt Directives (/robots.txt)", () => {
    it("returns valid robots.txt with admin disallow rules and sitemap location", async () => {
      const res = await request(app).get("/robots.txt");
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toContain("text/plain");
      expect(res.text).toContain("User-agent: *");
      expect(res.text).toContain("Disallow: /admin/");
      expect(res.text).toContain("Disallow: /api/v1/admin/");
      expect(res.text).toContain(`Sitemap: ${env.publicSiteUrl}/sitemap.xml`);
    });

    it("explicitly permits discovery crawlers for search and answer engines", async () => {
      const res = await request(app).get("/api/v1/robots.txt");
      expect(res.status).toBe(200);
      expect(res.text).toContain("User-agent: GPTBot");
      expect(res.text).toContain("User-agent: Google-Extended");
      expect(res.text).toContain("User-agent: PerplexityBot");
      expect(res.text).toContain("User-agent: ClaudeBot");
      expect(res.text).toContain("User-agent: Applebot-Extended");
    });
  });

  describe("LLMs.txt Manifest (/llms.txt)", () => {
    it("returns plain-text markdown discovery manifest", async () => {
      const res = await request(app).get("/llms.txt");
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toContain("text/plain");
      expect(res.text).toContain("# Murtaza Zaman - Professional Knowledge & Portfolio Manifest");
      expect(res.text).toContain("Murtaza Zaman");
      expect(res.text).toContain("Future Technology Builder & Software Engineer");
      expect(res.text).toContain(`${env.publicSiteUrl}/about`);
      expect(res.text).toContain(`${env.publicSiteUrl}/projects`);
      expect(res.text).toContain(`${env.publicSiteUrl}/services`);
    });

    it("is accessible under /api/v1/llms.txt as well", async () => {
      const res = await request(app).get("/api/v1/llms.txt");
      expect(res.status).toBe(200);
      expect(res.text).toContain("# Murtaza Zaman - Professional Knowledge & Portfolio Manifest");
    });
  });
});
