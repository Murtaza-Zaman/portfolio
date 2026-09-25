import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { Button } from "./Button";

describe("Button", () => {
  it("renders a semantic action button by default", () => {
    render(<Button>Save draft</Button>);

    expect(screen.getByRole("button", { name: "Save draft" })).toBeEnabled();
  });

  it("renders navigation as a link when href is provided", () => {
    render(<MemoryRouter><Button href="/admin">Open dashboard</Button></MemoryRouter>);

    expect(screen.getByRole("link", { name: "Open dashboard" })).toHaveAttribute("href", "/admin");
  });

  it("exposes disabled state to assistive technology", () => {
    render(<Button disabled>Sending</Button>);

    expect(screen.getByRole("button", { name: "Sending" })).toBeDisabled();
  });
});