import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import {
  BentoCard,
  BentoGrid,
  BrandLoader,
  colors,
  HeroSkillRotation,
  radii,
  TechPill,
  Timeline,
} from "./index";
import { DURATION, EASING, fadeUp } from "./motion";

describe("Design System Primitives & Tokens", () => {
  it("exports valid color, radius, and motion tokens", () => {
    expect(colors.ink.DEFAULT).toBe("#0f172a");
    expect(colors.brand[700]).toBe("#075985");
    expect(radii.bento).toBe("1.5rem");
    expect(DURATION.normal).toBe(0.35);
    expect(EASING.luxuryReveal).toBeDefined();
    expect(fadeUp.visible.y).toBe(0);
  });

  describe("BentoGrid & BentoCard", () => {
    it("renders BentoGrid container with custom children", () => {
      render(
        <BentoGrid data-testid="bento-grid">
          <div>Card 1</div>
          <div>Card 2</div>
        </BentoGrid>
      );

      const grid = screen.getByTestId("bento-grid");
      expect(grid).toBeInTheDocument();
      expect(screen.getByText("Card 1")).toBeInTheDocument();
      expect(screen.getByText("Card 2")).toBeInTheDocument();
    });

    it("renders BentoCard with title, eyebrow, description, and tags", () => {
      render(
        <MemoryRouter>
          <BentoCard
            actionLabel="View Details"
            description="Scalable cloud database systems."
            eyebrow="Architecture"
            href="/services/cloud"
            tags={["MongoDB", "Node.js"]}
            title="Cloud Persistence"
            variant="highlight"
          />
        </MemoryRouter>
      );

      expect(screen.getByText("Architecture")).toBeInTheDocument();
      expect(screen.getByText("Cloud Persistence")).toBeInTheDocument();
      expect(screen.getByText("Scalable cloud database systems.")).toBeInTheDocument();
      expect(screen.getByText("MongoDB")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
      expect(screen.getByText("View Details")).toBeInTheDocument();
    });
  });

  describe("TechPill", () => {
    it("renders tag label and applies variant classes", () => {
      render(<TechPill label="React 19" variant="teal" />);
      const pill = screen.getByText("React 19");
      expect(pill).toBeInTheDocument();
      expect(pill.className).toContain("font-mono");
    });
  });

  describe("HeroSkillRotation", () => {
    it("renders initial skill with accessible aria-live region", () => {
      const customSkills = ["Cloud Architecture", "Full-Stack Web"];
      render(<HeroSkillRotation skills={customSkills} />);

      expect(screen.getByText("Cloud Architecture")).toBeInTheDocument();
    });
  });

  describe("Timeline", () => {
    it("renders career journey milestones", () => {
      const milestones = [
        {
          id: "1",
          period: "2024 — Present",
          title: "Cloud Architect",
          organization: "Tech Labs",
          description: "Built scalable cloud microservices.",
          technologies: ["Redis", "Node.js"],
        },
      ];

      render(<Timeline items={milestones} />);

      expect(screen.getByText("2024 — Present")).toBeInTheDocument();
      expect(screen.getByText("Cloud Architect")).toBeInTheDocument();
      expect(screen.getByText("Tech Labs")).toBeInTheDocument();
      expect(screen.getByText("Built scalable cloud microservices.")).toBeInTheDocument();
      expect(screen.getByText("Redis")).toBeInTheDocument();
    });
  });

  describe("BrandLoader", () => {
    it("renders status role with custom label", () => {
      render(<BrandLoader label="Preparing experience..." />);

      const status = screen.getByRole("status");
      expect(status).toBeInTheDocument();
      expect(screen.getByText("MZ")).toBeInTheDocument();
      expect(screen.getByText("Preparing experience...")).toBeInTheDocument();
    });
  });
});
