import { describe, expect, it } from "vitest";

import { loginSchema } from "./authSchema";
import { contactSchema } from "./contactSchema";
import { projectFilterSchema } from "./filterSchema";

describe("Validation Schemas", () => {
  describe("contactSchema", () => {
    it("validates a complete and valid inquiry submission", () => {
      const validData = {
        inquiryType: "client",
        name: "Alice Engineer",
        email: "alice@example.com",
        organization: "Tech Corp",
        subject: "SaaS Project Opportunity",
        timeline: "1 month",
        budgetRange: "$10k - $25k",
        message: "We would like to discuss building a custom cloud microservices platform.",
        consent: true,
      };

      const result = contactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects when consent is false or missing", () => {
      const invalidData = {
        inquiryType: "client",
        name: "Alice",
        email: "alice@example.com",
        message: "Valid message length here for testing.",
        consent: false,
      };

      const result = contactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("consent"))).toBe(true);
      }
    });

    it("rejects invalid email and too short message", () => {
      const invalidData = {
        inquiryType: "client",
        name: "A",
        email: "not-an-email",
        message: "short",
        consent: true,
      };

      const result = contactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("accepts valid email and password", () => {
      const validData = {
        email: "admin@murtazazaman.com",
        password: "secretpassword123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects password shorter than 6 characters", () => {
      const invalidData = {
        email: "admin@murtazazaman.com",
        password: "123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("projectFilterSchema", () => {
    it("provides defaults for pagination", () => {
      const result = projectFilterSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(12);
    });
  });
});
