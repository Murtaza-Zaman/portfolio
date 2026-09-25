import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContentState } from "./ContentState";

describe("ContentState", () => {
  it("announces loading content politely", () => {
    render(<ContentState isLoading />);

    expect(screen.getByText("Loading content...")).toHaveAttribute("aria-live", "polite");
  });

  it("marks errors as assertive alerts", () => {
    render(<ContentState error={new Error("failed")} isLoading={false} />);

    expect(screen.getByRole("alert")).toHaveTextContent("temporarily unavailable");
  });

  it("renders the configured empty state", () => {
    render(<ContentState empty="Nothing published" isLoading={false} />);

    expect(screen.getByText("Nothing published")).toBeInTheDocument();
  });
});