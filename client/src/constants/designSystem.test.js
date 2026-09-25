import { describe, expect, it } from "vitest";

import {
  ACCESSIBILITY_SPEC,
  COLOR_SYSTEM_SPEC,
  COMPONENT_CATALOG,
  LAYOUT_SPEC,
  MOTION_SPEC,
  RESPONSIVE_SPEC,
  TYPOGRAPHY_SPEC,
  VISUAL_PHILOSOPHY,
} from "./designSystem";

describe("Visual Design Architecture Specification (Section 03)", () => {
  it("defines the balanced visual philosophy totaling 100%", () => {
    const { technology, luxuryConsulting, humanClarity, creativeExpression } = VISUAL_PHILOSOPHY.balance;
    expect(technology + luxuryConsulting + humanClarity + creativeExpression).toBe(100);
    expect(VISUAL_PHILOSOPHY.category).toBe("Premium Technology Personal Brand");
  });

  it("specifies the complete 5-layer color system with valid hex codes", () => {
    const hexPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

    expect(COLOR_SYSTEM_SPEC.foundation.darkSurface).toMatch(hexPattern);
    expect(COLOR_SYSTEM_SPEC.brand.primaryTeal).toMatch(hexPattern);
    expect(COLOR_SYSTEM_SPEC.accents.coralRose).toMatch(hexPattern);
    expect(COLOR_SYSTEM_SPEC.functional.success).toMatch(hexPattern);
    expect(COLOR_SYSTEM_SPEC.surfaces).toHaveLength(4);
  });

  it("defines typography hierarchy across all 8 roles", () => {
    expect(TYPOGRAPHY_SPEC.levels).toHaveLength(8);
    const tags = TYPOGRAPHY_SPEC.levels.map((l) => l.tag);
    expect(tags).toContain("Display");
    expect(tags).toContain("H1");
    expect(tags).toContain("Body");
    expect(tags).toContain("Technical");
  });

  it("configures structured layout grid and container max width", () => {
    expect(LAYOUT_SPEC.containerMaxWidth).toBe("max-w-6xl");
    expect(LAYOUT_SPEC.gridSystem.bentoCols).toBeDefined();
    expect(LAYOUT_SPEC.gridSystem.projectCols).toBeDefined();
  });

  it("organizes 5 levels of component hierarchy", () => {
    expect(COMPONENT_CATALOG.level1_foundation).toContain("Container");
    expect(COMPONENT_CATALOG.level2_navigation).toContain("SiteHeader");
    expect(COMPONENT_CATALOG.level3_content).toContain("Hero");
    expect(COMPONENT_CATALOG.level4_interaction).toContain("Button");
    expect(COMPONENT_CATALOG.level5_advanced).toContain("Timeline");
  });

  it("specifies motion timings and accessibility standards", () => {
    expect(MOTION_SPEC.durations.normal).toBe(0.35);
    expect(MOTION_SPEC.accessibility.reducedMotionSupport).toBe(true);
    expect(RESPONSIVE_SPEC.touchTargetMinSize).toContain("44px");
    expect(ACCESSIBILITY_SPEC.standard).toBe("WCAG 2.1 AA");
  });
});
