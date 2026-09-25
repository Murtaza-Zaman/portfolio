import { describe, expect, it } from "vitest";

import { formatBytes, formatDate, formatReadingTime, truncateText } from "./formatters";

describe("Formatters Utility", () => {
  describe("formatDate", () => {
    it("formats ISO string to readable date", () => {
      const formatted = formatDate("2026-05-15T00:00:00.000Z");
      expect(formatted).toContain("2026");
      expect(formatted).toContain("May");
    });

    it("returns empty string for invalid date", () => {
      expect(formatDate("invalid-date")).toBe("");
      expect(formatDate(null)).toBe("");
    });
  });

  describe("formatReadingTime", () => {
    it("formats numeric minutes", () => {
      expect(formatReadingTime(5)).toBe("5 min read");
      expect(formatReadingTime(2.4)).toBe("3 min read");
    });

    it("defaults to 1 min read for 0 or negative", () => {
      expect(formatReadingTime(0)).toBe("1 min read");
      expect(formatReadingTime(-1)).toBe("1 min read");
    });
  });

  describe("formatBytes", () => {
    it("formats bytes accurately", () => {
      expect(formatBytes(0)).toBe("0 B");
      expect(formatBytes(1024)).toBe("1 KB");
      expect(formatBytes(1048576)).toBe("1 MB");
      expect(formatBytes(2500000)).toBe("2.4 MB");
    });
  });

  describe("truncateText", () => {
    it("truncates text with ellipsis if length exceeded", () => {
      expect(truncateText("Hello world this is a test", 11)).toBe("Hello world...");
    });

    it("returns original text if within limit", () => {
      expect(truncateText("Short", 10)).toBe("Short");
    });
  });
});
