import { describe, expect, it } from "vitest";
import { generateSlug } from "./slugGenerator";
import { getOptimizedImageUrl, generateResponsiveSrcSet } from "./imageOptimizer";

describe("Frontend Utilities (Layer 10)", () => {
  describe("slugGenerator", () => {
    it("converts strings into clean, lowercase, URL-safe slugs", () => {
      expect(generateSlug("Murtaza Zaman - Full-Stack & Cloud Engineer")).toBe("murtaza-zaman-full-stack-cloud-engineer");
      expect(generateSlug("  Enterprise SaaS Platform 2026!  ")).toBe("enterprise-saas-platform-2026");
      expect(generateSlug("Building Modern Web Apps (Next.js & React)")).toBe("building-modern-web-apps-nextjs-react");
      expect(generateSlug("")).toBe("");
      expect(generateSlug(null)).toBe("");
    });
  });

  describe("imageOptimizer", () => {
    const cloudinarySample = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
    const nonCloudinary = "https://images.unsplash.com/photo-123456";

    it("injects Cloudinary transformation parameters properly", () => {
      const optimized = getOptimizedImageUrl(cloudinarySample, {
        width: 800,
        height: 600,
        crop: "fill",
        quality: "auto",
        format: "webp",
      });

      expect(optimized).toContain("/upload/f_webp,q_auto,c_fill,w_800,h_600/sample.jpg");
    });

    it("returns non-Cloudinary images untouched", () => {
      expect(getOptimizedImageUrl(nonCloudinary, { width: 800 })).toBe(nonCloudinary);
      expect(getOptimizedImageUrl("")).toBe("");
      expect(getOptimizedImageUrl(null)).toBe("");
    });

    it("generates responsive srcSet strings for Cloudinary assets", () => {
      const srcSet = generateResponsiveSrcSet(cloudinarySample, [400, 800, 1200]);
      expect(srcSet).toContain("w_400/sample.jpg 400w");
      expect(srcSet).toContain("w_800/sample.jpg 800w");
      expect(srcSet).toContain("w_1200/sample.jpg 1200w");
    });

    it("returns empty string for non-Cloudinary srcSets", () => {
      expect(generateResponsiveSrcSet(nonCloudinary)).toBe("");
    });
  });
});
