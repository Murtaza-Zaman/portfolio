import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  EngineeringIntelligenceSystem,
  SystemsEngineeredNode,
  EngineeringEvolutionNode,
  TechnologyConstellationNode,
  ArchitectureMindsetNode,
} from "./index";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe("EngineeringIntelligenceSystem Components", () => {
  it("renders the master Engineering Intelligence System section and HUD header", () => {
    const Wrapper = createWrapper();
    render(<EngineeringIntelligenceSystem />, { wrapper: Wrapper });

    expect(screen.getByText("Engineering Intelligence System")).toBeInTheDocument();
    expect(screen.getByText(/SYSTEM\.SPEC \/\/ ARCHITECTURE MATRIX/i)).toBeInTheDocument();
    expect(screen.getByText("NOMINAL")).toBeInTheDocument();
  });

  describe("SystemsEngineeredNode (Node 01)", () => {
    it("renders architecture tiers and allows interaction", () => {
      render(<SystemsEngineeredNode />);

      expect(screen.getByText("Systems Engineered")).toBeInTheDocument();
      expect(screen.getByText("Web Applications")).toBeInTheDocument();
      expect(screen.getByText("SaaS Platforms")).toBeInTheDocument();
      expect(screen.getByText("AI Systems")).toBeInTheDocument();
      expect(screen.getByText("Digital Products")).toBeInTheDocument();
    });

    it("renders custom CMS data when provided", () => {
      const cmsData = {
        nodeLabel: "NODE 01 // CUSTOM",
        title: "Custom Systems",
        description: "Custom description",
        items: [
          { label: "Custom App", tag: "Custom Spec", description: "Desc" },
        ],
      };
      render(<SystemsEngineeredNode data={cmsData} />);

      expect(screen.getByText("NODE 01 // CUSTOM")).toBeInTheDocument();
      expect(screen.getByText("Custom Systems")).toBeInTheDocument();
      expect(screen.getByText("Custom App")).toBeInTheDocument();
      expect(screen.getByText("Custom Spec")).toBeInTheDocument();
    });
  });

  describe("EngineeringEvolutionNode (Node 02)", () => {
    it("renders evolution pipeline progression stages", () => {
      render(<EngineeringEvolutionNode />);

      expect(screen.getByText("Engineering Evolution")).toBeInTheDocument();
      expect(screen.getByText("Frontend Engineering")).toBeInTheDocument();
      expect(screen.getByText("Backend Architecture")).toBeInTheDocument();
      expect(screen.getByText("Cloud Systems")).toBeInTheDocument();
      expect(screen.getByText("Artificial Intelligence")).toBeInTheDocument();
    });
  });

  describe("TechnologyConstellationNode (Node 03)", () => {
    it("renders domain buttons and updates inspector on selection", () => {
      render(<TechnologyConstellationNode />);

      expect(screen.getByText("Technology Domains")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Next.js")).toBeInTheDocument();
      expect(screen.getByText("AI")).toBeInTheDocument();

      // Click on React button
      fireEvent.click(screen.getByText("React"));
      expect(screen.getByText("Modern Frontend Engineering")).toBeInTheDocument();
    });
  });

  describe("ArchitectureMindsetNode (Node 04)", () => {
    it("renders 4-phase problem-solving framework", () => {
      render(<ArchitectureMindsetNode />);

      expect(screen.getByText("Architecture Mindset")).toBeInTheDocument();
      expect(screen.getByText(/Problem · Root Cause/i)).toBeInTheDocument();
      expect(screen.getByText(/Architecture · System Topology/i)).toBeInTheDocument();
      expect(screen.getByText(/Implementation · Disciplined/i)).toBeInTheDocument();
      expect(screen.getByText(/Impact · Measurable/i)).toBeInTheDocument();
    });
  });
});
