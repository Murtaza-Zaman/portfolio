import { describe, expect, it } from "vitest";
import {
  FRONTEND_STACK,
  APPLICATION_LAYERS,
  COMPONENT_HIERARCHY,
  STATE_TIERS,
  RESPONSIVE_BREAKPOINTS,
  PERFORMANCE_TARGETS,
  MOTION_LEVELS,
  SECURITY_STANDARDS,
  ADMIN_CMS_ENTITIES,
  PRODUCTION_CHECKLIST,
} from "./frontendArchitecture";

describe("Section 04 Frontend Engineering Architecture Specifications", () => {
  it("defines the core frontend stack adhering to 100% JavaScript and React 19 standards", () => {
    expect(FRONTEND_STACK.framework).toContain("React");
    expect(FRONTEND_STACK.buildTool).toBe("Vite");
    expect(FRONTEND_STACK.language).toContain("JavaScript");
    expect(FRONTEND_STACK.styling).toContain("Tailwind CSS");
    expect(FRONTEND_STACK.clientState).toBe("Zustand");
    expect(FRONTEND_STACK.serverState).toBe("TanStack React Query");
    expect(FRONTEND_STACK.forms).toBe("React Hook Form");
    expect(FRONTEND_STACK.validation).toBe("Zod");
    expect(FRONTEND_STACK.routing).toBe("React Router");
    expect(FRONTEND_STACK.animation).toBe("Framer Motion");
    expect(FRONTEND_STACK.targetPerformance).toBe("Lighthouse 95+");
  });

  it("specifies the 10 core architectural application layers", () => {
    const layers = Object.keys(APPLICATION_LAYERS);
    expect(layers).toHaveLength(10);
    expect(APPLICATION_LAYERS.LAYER_01_APP_CORE.path).toBe("src/app");
    expect(APPLICATION_LAYERS.LAYER_02_ROUTING.path).toBe("src/routes");
    expect(APPLICATION_LAYERS.LAYER_03_FEATURES.path).toBe("src/features");
    expect(APPLICATION_LAYERS.LAYER_04_SHARED_COMPONENTS.path).toBe("src/components");
    expect(APPLICATION_LAYERS.LAYER_05_ADMIN_DASHBOARD.path).toBe("src/features/admin");
    expect(APPLICATION_LAYERS.LAYER_06_API_SERVICES.path).toBe("src/services");
    expect(APPLICATION_LAYERS.LAYER_07_CUSTOM_HOOKS.path).toBe("src/hooks");
    expect(APPLICATION_LAYERS.LAYER_08_STATE_MANAGEMENT.path).toBe("src/store");
    expect(APPLICATION_LAYERS.LAYER_09_SCHEMA_VALIDATION.path).toBe("src/schemas");
    expect(APPLICATION_LAYERS.LAYER_10_UTILITIES.path).toBe("src/utils");
  });

  it("defines the 5 component hierarchy levels", () => {
    const levels = Object.values(COMPONENT_HIERARCHY);
    expect(levels).toHaveLength(5);
    expect(levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5]);
    expect(COMPONENT_HIERARCHY.LEVEL_01_FOUNDATION.location).toBe("src/components/ui");
    expect(COMPONENT_HIERARCHY.LEVEL_02_SHARED.location).toBe("src/components/common");
    expect(COMPONENT_HIERARCHY.LEVEL_03_LAYOUT.location).toBe("src/layouts");
    expect(COMPONENT_HIERARCHY.LEVEL_04_FEATURE.location).toContain("features");
    expect(COMPONENT_HIERARCHY.LEVEL_05_PAGE.location).toContain("pages");
  });

  it("enforces clear separation between Local UI, Global Client, and Server state tiers", () => {
    expect(STATE_TIERS.LOCAL_UI.tool).toContain("useState");
    expect(STATE_TIERS.GLOBAL_CLIENT.tool).toBe("Zustand");
    expect(STATE_TIERS.SERVER_STATE.tool).toBe("TanStack React Query");
  });

  it("specifies mobile-first responsive breakpoints and touch targets", () => {
    expect(RESPONSIVE_BREAKPOINTS.strategy).toBe("Mobile-First");
    expect(RESPONSIVE_BREAKPOINTS.minTouchTargetPx).toBeGreaterThanOrEqual(44);
    expect(RESPONSIVE_BREAKPOINTS.sm.minWidth).toBe(640);
    expect(RESPONSIVE_BREAKPOINTS.md.minWidth).toBe(768);
    expect(RESPONSIVE_BREAKPOINTS.lg.minWidth).toBe(1024);
    expect(RESPONSIVE_BREAKPOINTS.xl.minWidth).toBe(1280);
    expect(RESPONSIVE_BREAKPOINTS["2xl"].minWidth).toBe(1536);
  });

  it("specifies performance standards and Core Web Vitals thresholds", () => {
    expect(PERFORMANCE_TARGETS.lighthouseScore).toBe(95);
    expect(PERFORMANCE_TARGETS.coreWebVitals.lcpSecondsMax).toBeLessThanOrEqual(2.5);
    expect(PERFORMANCE_TARGETS.coreWebVitals.clsScoreMax).toBeLessThanOrEqual(0.1);
    expect(PERFORMANCE_TARGETS.coreWebVitals.inpMsMax).toBeLessThanOrEqual(200);
  });

  it("defines motion architecture levels and reduced motion compliance", () => {
    expect(MOTION_LEVELS.LEVEL_01_GLOBAL.level).toBe(1);
    expect(MOTION_LEVELS.LEVEL_02_SECTION.level).toBe(2);
    expect(MOTION_LEVELS.LEVEL_03_MICRO.level).toBe(3);
    expect(MOTION_LEVELS.rules.some((r) => r.includes("reduced-motion"))).toBe(true);
  });

  it("defines security standards and role permissions", () => {
    expect(SECURITY_STANDARDS.roles).toContain("ADMIN");
    expect(SECURITY_STANDARDS.roles).toContain("EDITOR");
    expect(SECURITY_STANDARDS.roles).toContain("CONTENT_MANAGER");
    expect(SECURITY_STANDARDS.permissions.ADMIN.canDelete).toBe(true);
    expect(SECURITY_STANDARDS.permissions.EDITOR.canDelete).toBe(false);
    expect(SECURITY_STANDARDS.permissions.CONTENT_MANAGER.canConfigureSeo).toBe(false);
  });

  it("covers all 12 admin CMS entity resources", () => {
    expect(ADMIN_CMS_ENTITIES).toHaveLength(12);
    expect(ADMIN_CMS_ENTITIES).toContain("projects");
    expect(ADMIN_CMS_ENTITIES).toContain("services");
    expect(ADMIN_CMS_ENTITIES).toContain("inquiries");
    expect(ADMIN_CMS_ENTITIES).toContain("media-library");
    expect(ADMIN_CMS_ENTITIES).toContain("site-settings");
  });

  it("contains comprehensive production release checklist", () => {
    expect(PRODUCTION_CHECKLIST.length).toBeGreaterThanOrEqual(10);
  });
});
