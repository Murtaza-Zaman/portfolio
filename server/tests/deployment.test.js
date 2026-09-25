import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { DEPLOYMENT_CONFIG } from "../src/constants/deployment.js";
import { logger, logSecurityEvent, logAdminAction } from "../src/config/logger/index.js";
import { sentryService } from "../src/services/sentryService.js";

describe("Section 10 Deployment, DevOps, Security & Production Architecture (Server)", () => {
  it("responds successfully to the infrastructure health check endpoint GET /api/health", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.timestamp).toBeDefined();
  });

  it("defines deployment configuration matching Section 10 infrastructure decisions", () => {
    expect(DEPLOYMENT_CONFIG.frontend.platform).toBe("Vercel");
    expect(DEPLOYMENT_CONFIG.frontend.buildCommand).toBe("npm run build");
    expect(DEPLOYMENT_CONFIG.backend.platform).toBe("Render Professional");
    expect(DEPLOYMENT_CONFIG.backend.startCommand).toBe("npm start");
    expect(DEPLOYMENT_CONFIG.database.provider).toBe("MongoDB Atlas");
    expect(DEPLOYMENT_CONFIG.database.tier).toBe("Single Production Database");
    expect(DEPLOYMENT_CONFIG.media.provider).toBe("Cloudinary");
    expect(DEPLOYMENT_CONFIG.media.folders.projects).toBe("portfolio/projects");
  });

  it("configures security middleware, rate limits, and JWT expiry policies", () => {
    expect(DEPLOYMENT_CONFIG.security.authentication).toContain("JWT");
    expect(DEPLOYMENT_CONFIG.security.middleware).toContain("helmet");
    expect(DEPLOYMENT_CONFIG.security.middleware).toContain("cors");
    expect(DEPLOYMENT_CONFIG.security.rateLimits.auth).toBeDefined();
    expect(DEPLOYMENT_CONFIG.security.rateLimits.inquiries).toBeDefined();
    expect(DEPLOYMENT_CONFIG.security.rateLimits.publicApi).toBeDefined();
  });

  it("provides Winston logger methods without throwing runtime errors", () => {
    expect(logger.info).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.error).toBeDefined();

    // Verify security logging helper
    expect(() => {
      logSecurityEvent("TEST_SECURITY_EVENT", { ip: "127.0.0.1", password: "secret_should_be_stripped" });
    }).not.toThrow();

    // Verify admin audit helper
    expect(() => {
      logAdminAction("TEST_ADMIN_ACTION", { resource: "projects", id: "p1" });
    }).not.toThrow();
  });

  it("provides Sentry monitoring service with captureException and captureMessage methods", () => {
    expect(sentryService.init).toBeDefined();
    expect(sentryService.captureException).toBeDefined();
    expect(sentryService.captureMessage).toBeDefined();

    expect(() => {
      sentryService.captureMessage("Test observation message", "info");
      sentryService.captureException(new Error("Test tracked exception"), { path: "/api/test" });
    }).not.toThrow();
  });

  it("contains complete 4-phase scalability roadmap", () => {
    expect(DEPLOYMENT_CONFIG.scalabilityRoadmap).toHaveLength(4);
    expect(DEPLOYMENT_CONFIG.scalabilityRoadmap[0].name).toBe("Portfolio Platform");
    expect(DEPLOYMENT_CONFIG.scalabilityRoadmap[1].name).toBe("Advanced CMS");
    expect(DEPLOYMENT_CONFIG.scalabilityRoadmap[2].name).toBe("Client Portal");
    expect(DEPLOYMENT_CONFIG.scalabilityRoadmap[3].name).toBe("SaaS Platform");
  });
});
