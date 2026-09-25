import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GenesisPreloader } from "./GenesisPreloader";

describe("GenesisPreloader — Single-Screen 3D Glass Crystal Preloader", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("renders the preloader dialog container on initial launch in single-screen mode", () => {
    render(<GenesisPreloader forcePlay={true} />);
    expect(
      screen.getByRole("dialog", { name: /portfolio initialization experience/i })
    ).toBeInTheDocument();
  });

  it("displays the Skip button and triggers completion", () => {
    const onComplete = vi.fn();
    render(<GenesisPreloader forcePlay={true} onComplete={onComplete} />);

    const skipButton = screen.getByRole("button", { name: /skip initialization animation/i });
    expect(skipButton).toBeInTheDocument();

    fireEvent.click(skipButton);
    expect(sessionStorage.getItem("murtaza_genesis_seen")).toBe("true");
  });

  it("handles sound toggle interactions without crashing", () => {
    render(<GenesisPreloader forcePlay={true} />);
    const soundButton = screen.getByRole("button", { name: /enable audio soundscape/i });
    expect(soundButton).toBeInTheDocument();

    fireEvent.click(soundButton);
    expect(
      screen.getByRole("button", { name: /mute audio soundscape/i })
    ).toBeInTheDocument();
  });

  it("skips automatically if session already marked as seen and forcePlay is false", () => {
    sessionStorage.setItem("murtaza_genesis_seen", "true");
    const onComplete = vi.fn();
    const { container } = render(<GenesisPreloader forcePlay={false} onComplete={onComplete} />);

    expect(container.firstChild).toBeNull();
    expect(onComplete).toHaveBeenCalled();
  });
});
