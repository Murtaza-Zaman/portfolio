import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { WhatsAppButton } from "./WhatsAppButton";

describe("WhatsAppButton Component", () => {
  it("renders floating WhatsApp redirect link with correct attributes on default routes", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <WhatsAppButton />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /Chat with Murtaza Zaman on WhatsApp/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.getAttribute("href")).toContain("wa.me");
  });

  it("does not render floating button on /contact route to avoid duplication", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/contact"]}>
        <WhatsAppButton />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});
