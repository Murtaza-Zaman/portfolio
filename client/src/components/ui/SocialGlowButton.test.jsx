import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SocialGlowButton, getSocialIcon } from "./SocialGlowButton";
import { Github, Linkedin, Twitter, MessageCircle } from "lucide-react";

describe("SocialGlowButton Component", () => {
  it("renders a glowing circular button redirecting to platform with correct attributes", () => {
    render(
      <SocialGlowButton
        platform="GitHub"
        label="GitHub Profile"
        url="https://github.com/murtazazaman"
        color="cyan"
      />
    );

    const link = screen.getByRole("link", { name: "GitHub Profile" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://github.com/murtazazaman");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("resolves correct Lucide icons for supported social networks", () => {
    expect(getSocialIcon("GitHub")).toBe(Github);
    expect(getSocialIcon("LinkedIn")).toBe(Linkedin);
    expect(getSocialIcon("Twitter")).toBe(Twitter);
    expect(getSocialIcon("WhatsApp")).toBe(MessageCircle);
  });

  it("supports purple, cyan, emerald and other glow colors", () => {
    const { container } = render(
      <SocialGlowButton
        platform="Twitter"
        label="Twitter / X"
        url="https://twitter.com/murtazazaman"
        color="purple"
      />
    );

    const link = container.querySelector("a");
    expect(link.className).toContain("border-purple-500/40");
    expect(link.className).toContain("text-purple-400");
  });
});
