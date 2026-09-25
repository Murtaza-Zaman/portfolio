import { describe, expect, it } from "vitest";

import { brand } from "../constants/brand";
import { evaluateBrandAlignment } from "./brandValidator";

describe("Brand Validator Engine (Section 01I)", () => {
  it("scores compliant brand statement with a high passing score (>= 90)", () => {
    const compliantText =
      "Murtaza Zaman builds modern software applications and high-performance digital solutions by combining full-stack web engineering, scalable cloud architecture, and digital growth strategies.";

    const result = evaluateBrandAlignment(compliantText);
    expect(result.isPassing).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.breakdown.identity).toBe(25);
    expect(result.breakdown.positioning).toBe(25);
    expect(result.breakdown.credibility).toBe(15);
    expect(result.issues).toHaveLength(0);
  });

  it("penalizes copy with prohibited hype buzzwords", () => {
    const hypeText =
      "I am a coding ninja and software rockstar guru delivering world-class unbeatable results and guaranteed success.";

    const result = evaluateBrandAlignment(hypeText);
    expect(result.isPassing).toBe(false);
    expect(result.breakdown.credibility).toBeLessThan(15);
    expect(result.issues.some((issue) => issue.includes("prohibited hype"))).toBe(true);
  });

  it("penalizes copy that reduces identity to a generic code-only developer", () => {
    const narrowText =
      "I am just a developer who will merely write code for whatever requirements are handed over.";

    const result = evaluateBrandAlignment(narrowText);
    expect(result.breakdown.identity).toBeLessThan(25);
    expect(result.issues.some((issue) => issue.includes("reduced to a narrow"))).toBe(true);
  });

  it("handles empty or invalid inputs safely", () => {
    const result = evaluateBrandAlignment("");
    expect(result.isPassing).toBe(false);
    expect(result.score).toBe(0);
    expect(result.issues).toContain("Text content is empty or invalid.");
  });

  it("successfully verifies the official brand positioning statement", () => {
    const result = evaluateBrandAlignment(brand.positioning);
    expect(result.isPassing).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(90);
  });
});
