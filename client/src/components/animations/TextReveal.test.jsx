import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextReveal } from "./TextReveal";

describe("TextReveal Component", () => {
  it("renders text content with proper accessibility attributes", () => {
    render(<TextReveal variant="heading">Future Technology Builder</TextReveal>);
    const element = screen.getByLabelText("Future Technology Builder");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("data-split-variant", "heading");
  });

  it("splits character-based variants into split-char tokens", () => {
    const { container } = render(
      <TextReveal variant="hero">Engineering</TextReveal>
    );
    const chars = container.querySelectorAll(".split-char");
    expect(chars.length).toBeGreaterThan(0);
    expect(chars[0].textContent).toBe("E");
  });

  it("splits word-based variant into split-word tokens", () => {
    const { container } = render(
      <TextReveal variant="body">Software architecture and AI systems.</TextReveal>
    );
    const words = container.querySelectorAll(".split-word");
    expect(words.length).toBe(5);
    expect(words[0].textContent).toBe("Software");
  });

  it("supports custom HTML tags via 'as' prop", () => {
    render(
      <TextReveal as="h1" variant="hero">
        Main Title
      </TextReveal>
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
