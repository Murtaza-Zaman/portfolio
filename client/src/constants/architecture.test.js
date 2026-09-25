import { describe, expect, it } from "vitest";

import {
  CONTENT_ENTITY_GRAPH,
  CORE_PAGES,
  CTA_COMMITMENT_TIERS,
  GROWTH_ROADMAP,
  STRATEGIC_LAYERS,
  USER_JOURNEYS,
} from "./architecture";
import { ROUTES } from "./routes";

describe("Website Strategy & Information Architecture (Section 02)", () => {
  it("defines the 6 core website pages", () => {
    expect(CORE_PAGES).toHaveLength(6);
    const paths = CORE_PAGES.map((p) => p.path);
    expect(paths).toContain(ROUTES.PUBLIC.HOME);
    expect(paths).toContain(ROUTES.PUBLIC.ABOUT);
    expect(paths).toContain(ROUTES.PUBLIC.SERVICES);
    expect(paths).toContain(ROUTES.PUBLIC.PROJECTS);
    expect(paths).toContain(ROUTES.PUBLIC.RESUME);
    expect(paths).toContain(ROUTES.PUBLIC.CONTACT);

    CORE_PAGES.forEach((page) => {
      expect(page.purpose).toBeDefined();
      expect(page.visitorIntent).toBeDefined();
      expect(page.requiredBlocks.length).toBeGreaterThan(0);
      expect(page.nextAction).toBeDefined();
    });
  });

  it("structures the 4 strategic information levels", () => {
    expect(STRATEGIC_LAYERS.IDENTITY.level).toBe(1);
    expect(STRATEGIC_LAYERS.CAPABILITY.level).toBe(2);
    expect(STRATEGIC_LAYERS.PROOF.level).toBe(3);
    expect(STRATEGIC_LAYERS.ENGAGEMENT.level).toBe(4);
  });

  it("maps user conversion flows terminating in professional contact", () => {
    // Client journey flow
    expect(USER_JOURNEYS.CLIENT_PATH.sequence).toEqual([
      ROUTES.PUBLIC.HOME,
      ROUTES.PUBLIC.SERVICES,
      ROUTES.PUBLIC.PROJECTS,
      ROUTES.PUBLIC.CONTACT,
    ]);

    // Recruiter journey flow
    expect(USER_JOURNEYS.RECRUITER_PATH.sequence).toEqual([
      ROUTES.PUBLIC.HOME,
      ROUTES.PUBLIC.ABOUT,
      ROUTES.PUBLIC.PROJECTS,
      ROUTES.PUBLIC.RESUME,
      ROUTES.PUBLIC.CONTACT,
    ]);
  });

  it("organizes 3 commitment tiers of CTAs without aggressive sales pressure", () => {
    expect(CTA_COMMITMENT_TIERS.LOW.tier).toBe("Low Commitment");
    expect(CTA_COMMITMENT_TIERS.MEDIUM.tier).toBe("Medium Commitment");
    expect(CTA_COMMITMENT_TIERS.HIGH.tier).toBe("High Commitment");

    const allExamples = [
      ...CTA_COMMITMENT_TIERS.LOW.examples,
      ...CTA_COMMITMENT_TIERS.MEDIUM.examples,
      ...CTA_COMMITMENT_TIERS.HIGH.examples,
    ];

    allExamples.forEach((cta) => {
      expect(cta).not.toMatch(/buy now|act now|limited time/i);
    });
  });

  it("defines the 4-entity relational content model", () => {
    expect(CONTENT_ENTITY_GRAPH.entities).toHaveLength(4);
    const entityNames = CONTENT_ENTITY_GRAPH.entities.map((e) => e.name);
    expect(entityNames).toContain("Profile");
    expect(entityNames).toContain("Service");
    expect(entityNames).toContain("Project");
    expect(entityNames).toContain("Technology");
  });

  it("defines the 4 growth phases of ecosystem evolution", () => {
    expect(GROWTH_ROADMAP).toHaveLength(4);
    expect(GROWTH_ROADMAP[0].phase).toBe(1);
    expect(GROWTH_ROADMAP[0].name).toContain("Portfolio Foundation");
    expect(GROWTH_ROADMAP[2].name).toContain("SaaS Ecosystem");
  });
});
