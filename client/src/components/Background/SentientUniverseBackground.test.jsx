import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SentientUniverseBackground } from "./SentientUniverseBackground";

describe("SentientUniverseBackground — Clean Master Living Environment", () => {
  it("renders background container and canvas layers", () => {
    const { container } = render(<SentientUniverseBackground />);
    const bgContainer = screen.getByTestId("sentient-universe-background");
    expect(bgContainer).toBeInTheDocument();
    expect(bgContainer).toHaveAttribute("aria-hidden", "true");

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });
});
