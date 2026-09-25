import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

const rafMock = (cb) => setTimeout(cb, 16);
const cafMock = (id) => clearTimeout(id);

globalThis.requestAnimationFrame = rafMock;
globalThis.cancelAnimationFrame = cafMock;

if (typeof window !== "undefined") {
  window.requestAnimationFrame = rafMock;
  window.cancelAnimationFrame = cafMock;
  if (!globalThis.getComputedStyle) {
    globalThis.getComputedStyle = window.getComputedStyle.bind(window);
  }
}

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.disable(false, true);
gsap.ticker.sleep();

afterEach(() => {
  try {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    ScrollTrigger.disable(false, true);
    gsap.killTweensOf("*");
    gsap.globalTimeline.clear();
    gsap.ticker.sleep();
  } catch {
    // Ignored in tests
  }
});

HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: () => {},
  fillRect: () => {},
  beginPath: () => {},
  arc: () => {},
  fill: () => {},
  stroke: () => {},
  moveTo: () => {},
  lineTo: () => {},
  quadraticCurveTo: () => {},
  save: () => {},
  restore: () => {},
  translate: () => {},
  rotate: () => {},
  setLineDash: () => {},
  setTransform: () => {},
  createRadialGradient: () => ({ addColorStop: () => {} }),
  createLinearGradient: () => ({ addColorStop: () => {} }),
  fillText: () => {},
  strokeText: () => {},
  measureText: () => ({ width: 100 }),
  getImageData: () => ({ data: new Uint8ClampedArray(400) }),
});