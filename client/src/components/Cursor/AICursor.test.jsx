import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AICursor } from "./AICursor";
import { cursorState } from "./CursorState";

describe("AICursor Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("exports cursorState with correct initial values", () => {
    expect(cursorState.mode).toBe("default");
    expect(cursorState.label).toBe("");
    expect(cursorState.isIdle).toBe(false);
  });

  it("updates mode and notifies subscribers", () => {
    const listener = vi.fn();
    const unsubscribe = cursorState.subscribe(listener);

    cursorState.setMode("project", "VIEW SYSTEM");
    expect(cursorState.mode).toBe("project");
    expect(cursorState.label).toBe("VIEW SYSTEM");
    expect(listener).toHaveBeenCalled();

    unsubscribe();
  });

  it("renders without crashing in DOM environment", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("hover: hover") && query.includes("pointer: fine"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<AICursor />);
    expect(container).toBeDefined();
  });

  it("safely resets idle thinking mode on mouse movement", () => {
    cursorState.setMode("thinking", "AI THINKING");
    expect(cursorState.mode).toBe("thinking");

    cursorState.onMouseMove({ clientX: 100, clientY: 200 });
    expect(cursorState.mode).toBe("default");
  });
});
