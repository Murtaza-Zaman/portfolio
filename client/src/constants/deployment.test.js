import { describe, expect, it } from "vitest";
import { CLIENT_DEPLOYMENT_CONFIG } from "./deployment";

describe("Section 10 Deployment & Production Architecture (Client)", () => {
  it("specifies Vercel deployment and React 19 + Vite build configuration", () => {
    expect(CLIENT_DEPLOYMENT_CONFIG.platform).toBe("Vercel");
    expect(CLIENT_DEPLOYMENT_CONFIG.framework).toContain("React 19");
    expect(CLIENT_DEPLOYMENT_CONFIG.buildCommand).toBe("npm run build");
    expect(CLIENT_DEPLOYMENT_CONFIG.outputDirectory).toBe("dist");
    expect(CLIENT_DEPLOYMENT_CONFIG.environmentVariables.apiUrl).toBe("VITE_API_URL");
    expect(CLIENT_DEPLOYMENT_CONFIG.spaRouting.fallback).toBe("/index.html");
  });

  it("contains comprehensive production checklist", () => {
    expect(CLIENT_DEPLOYMENT_CONFIG.productionChecklist.length).toBeGreaterThanOrEqual(5);
    expect(
      CLIENT_DEPLOYMENT_CONFIG.productionChecklist.some((item) => item.includes("production build"))
    ).toBe(true);
    expect(
      CLIENT_DEPLOYMENT_CONFIG.productionChecklist.some((item) => item.includes("SEO"))
    ).toBe(true);
    expect(
      CLIENT_DEPLOYMENT_CONFIG.productionChecklist.some((item) => item.includes("Lighthouse 95+"))
    ).toBe(true);
  });

  it("includes Sentry error tracking configuration object", () => {
    expect(CLIENT_DEPLOYMENT_CONFIG.sentry).toBeDefined();
    expect(typeof CLIENT_DEPLOYMENT_CONFIG.sentry.enabled).toBe("boolean");
  });
});
