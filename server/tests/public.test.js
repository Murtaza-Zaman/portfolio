import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../src/app.js";

describe("Backend Public & System Endpoints", () => {
  it("returns health check on /api/v1/health", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("ok");
  });

  it("returns infrastructure health check on /api/health", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("returns navigation structure", async () => {
    const res = await request(app).get("/api/v1/navigation");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("returns valid robots.txt", async () => {
    const res = await request(app).get("/api/v1/robots.txt");
    expect(res.status).toBe(200);
    expect(res.text).toContain("User-agent: *");
  });

  it("returns valid XML sitemap", async () => {
    const res = await request(app).get("/api/v1/sitemap.xml");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("xml");
    expect(res.text).toContain("<urlset");
  });

  it("returns showcase-cards array on /api/v1/showcase-cards", async () => {
    const res = await request(app).get("/api/v1/showcase-cards");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("rejects invalid contact inquiry without required fields", async () => {
    const res = await request(app).post("/api/v1/inquiries").send({
      inquiryType: "invalid-type",
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});
