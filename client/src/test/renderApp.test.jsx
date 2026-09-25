import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { HomePage } from "../features/home/HomePage";
import { PublicLayout } from "../layouts/PublicLayout";
import { AboutPage } from "../features/about/AboutPage";
import { ServicesPage } from "../features/services/ServicesPage";
import { ProjectsPage } from "../features/projects/ProjectsPage";
import { ContactPage } from "../features/contact/ContactPage";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Direct Page Renders", () => {
  it("renders PublicLayout", () => {
    const Wrapper = createWrapper();
    render(<PublicLayout />, { wrapper: Wrapper });
  }, 15000);

  it("renders HomePage", () => {
    const Wrapper = createWrapper();
    render(<HomePage />, { wrapper: Wrapper });
  }, 15000);

  it("renders AboutPage", () => {
    const Wrapper = createWrapper();
    render(<AboutPage />, { wrapper: Wrapper });
  }, 15000);

  it("renders ServicesPage", () => {
    const Wrapper = createWrapper();
    render(<ServicesPage />, { wrapper: Wrapper });
  }, 15000);

  it("renders ProjectsPage", () => {
    const Wrapper = createWrapper();
    render(<ProjectsPage />, { wrapper: Wrapper });
  }, 15000);

  it("renders ContactPage", () => {
    const Wrapper = createWrapper();
    render(<ContactPage />, { wrapper: Wrapper });
  }, 15000);
});
