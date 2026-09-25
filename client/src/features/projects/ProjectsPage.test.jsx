import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProjectsPage } from "./ProjectsPage";

function renderProjectsPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ProjectsPage — Rebuilt Editorial Layout", () => {
  it("renders large display heading and breadcrumb", () => {
    renderProjectsPage();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("PROJECTS");
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders numbered project rows with tags and previews", () => {
    renderProjectsPage();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("SEO-Driven Developer Platform")).toBeInTheDocument();
    expect(screen.getByText("Multi-Tenant Analytics SaaS")).toBeInTheDocument();
  });

  it("renders bottom-left micro-CTA", () => {
    renderProjectsPage();
    expect(screen.getByText("Wanna Say Hello?")).toBeInTheDocument();
    expect(screen.getByText("contact@murtazazaman.com")).toBeInTheDocument();
  });
});
