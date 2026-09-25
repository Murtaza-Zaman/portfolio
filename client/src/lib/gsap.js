/**
 * GSAP Configuration — registers all plugins, sets global defaults.
 * Import this ONCE at the app root, then use gsap from this module
 * everywhere else to guarantee plugins are registered.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { Flip } from "gsap/Flip";

// Register all plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, Flip);

// Global defaults — only transform + opacity animated for perf
gsap.defaults({
  ease: "power3.out",
  duration: 0.7,
});

// Reduced-motion override: shrink every animation if user prefers
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.globalTimeline.timeScale(100); // effectively instant
});

export { gsap, ScrollTrigger, TextPlugin, Flip };
export default gsap;
