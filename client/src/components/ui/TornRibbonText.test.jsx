import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TornRibbonText, InteractiveLetter } from "./TornRibbonText";

describe("TornRibbonText Component - Reusable & Interactive", () => {
  it("renders heading and accessible label with line1/line2", () => {
    render(<TornRibbonText line1="MURTAZA" line2="ZAMAN" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute("aria-label", "MURTAZA ZAMAN");
  });

  it("renders with singleLine prop", () => {
    render(<TornRibbonText singleLine="PORTFOLIO" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute("aria-label", "PORTFOLIO");
  });

  it("renders with lines array prop", () => {
    render(<TornRibbonText lines={["FIRST", "SECOND", "THIRD"]} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute("aria-label", "FIRST SECOND THIRD");
  });

  it("renders individual interactive letters and triggers drag hooks", () => {
    const onDragStart = vi.fn();
    const onDragEnd = vi.fn();

    const { container } = render(
      <TornRibbonText
        line1="MURTAZA"
        line2="ZAMAN"
        onLetterDragStart={onDragStart}
        onLetterDragEnd={onDragEnd}
      />
    );

    const firstLetter = container.querySelector(".cursor-grab");
    expect(firstLetter).toBeInTheDocument();

    fireEvent.pointerDown(firstLetter, {
      clientX: 100,
      clientY: 100,
      pointerId: 1,
      button: 0,
      pointerType: "mouse",
    });

    expect(onDragStart).toHaveBeenCalledWith(
      expect.objectContaining({
        char: "M",
        lineIndex: 0,
        charIndex: 0,
      })
    );

    fireEvent.pointerMove(firstLetter, {
      clientX: 130,
      clientY: 160,
      pointerId: 1,
    });

    fireEvent.pointerUp(firstLetter, {
      pointerId: 1,
    });
  });

  it("renders standalone InteractiveLetter", () => {
    const activeDragRef = { current: null };
    const { getByText } = render(
      <InteractiveLetter
        char="X"
        letterKey="test-x"
        activeDragKeyRef={activeDragRef}
      />
    );
    expect(getByText("X")).toBeInTheDocument();
  });
});
