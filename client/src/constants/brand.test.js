import { describe, expect, it } from "vitest";

import { brand } from "./brand";

describe("Brand Identity Specification (Section 01)", () => {
  it("maintains exact professional name and primary identity", () => {
    expect(brand.name).toBe("Murtaza Zaman");
    expect(brand.identity).toBe("Future Technology Builder");
    expect(brand.category).toBe("Technology Builder");
  });

  it("defines primary professional title and 5 years experience", () => {
    expect(brand.title).toContain("Full Stack Developer");
    expect(brand.title).toContain("Cloud & Backend Architect");
    expect(brand.title).toContain("SEO Specialist");
    expect(brand.experienceYears).toBe(5);
    expect(brand.experienceLabel).toContain("5+ Years");
  });

  it("includes 3 core expertise pillars with competencies", () => {
    expect(brand.pillars).toHaveLength(3);
    const titles = brand.pillars.map((p) => p.title);
    expect(titles).toContain("Full-Stack Software Development");
    expect(titles).toContain("Cloud & Backend Architecture");
    expect(titles).toContain("SEO & Digital Growth Engineering");

    brand.pillars.forEach((pillar) => {
      expect(pillar.role).toBeDefined();
      expect(pillar.purpose).toBeDefined();
      expect(pillar.competencies.length).toBeGreaterThan(0);
    });
  });

  it("specifies 5 core brand personality traits and audiences", () => {
    expect(brand.traits).toContain("Innovative");
    expect(brand.traits).toContain("Intelligent");
    expect(brand.traits).toContain("Creative");
    expect(brand.traits).toContain("Trustworthy");
    expect(brand.traits).toContain("Professional");

    const audienceSegments = brand.audiences.map((a) => a.segment || a);
    expect(audienceSegments).toContain("International Clients");
    expect(audienceSegments).toContain("Technology Recruiters");
    expect(audienceSegments).toContain("Business Decision Makers");
    expect(audienceSegments).toContain("Technology Partners");
  });

  it("defines core brand equations, promise, and authority dimensions", () => {
    expect(brand.equation).toContain("Software Engineering");
    expect(brand.equation).toContain("Cloud Systems");
    expect(brand.equation).toContain("Digital Growth");
    expect(brand.promise).toContain("transform ideas into functional, reliable");
    expect(brand.authorityDimensions).toHaveLength(5);
  });

  it("provides vocabulary guidelines and prohibited anti-patterns", () => {
    expect(brand.vocabulary.preferredVerbs).toContain("Build");
    expect(brand.vocabulary.preferredVerbs).toContain("Engineer");
    expect(brand.vocabulary.preferredNouns).toContain("Solutions");
    expect(brand.vocabulary.prohibitedAntiPatterns).toEqual(
      expect.arrayContaining([expect.stringMatching(/ninja/i), expect.stringMatching(/guru/i)])
    );
  });
});
