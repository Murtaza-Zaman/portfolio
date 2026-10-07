/**
 * GSAP Configuration — registers all plugins, sets global defaults.
 * Import this ONCE at the app root, then use gsap from this module
 * everywhere else to guarantee plugins are registered.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { Flip } from "gsap/Flip";

let initialized = false;

export function ensureGSAP() {
  if (initialized) return;
  initialized = true;

  gsap.registerPlugin(ScrollTrigger, TextPlugin, Flip);

  gsap.defaults({
    ease: "power3.out",
    duration: 0.7,
  });

  if (typeof window !== "undefined" && window.matchMedia) {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.globalTimeline.timeScale(100);
    });
  }
}

// Transparent Proxy to auto-initialize plugins on first access
const gsapProxy = new Proxy(gsap, {
  get(target, prop, receiver) {
    if (!initialized) {
      ensureGSAP();
    }
    const val = Reflect.get(target, prop, receiver);
    if (typeof val === "function") {
      return val.bind(target);
    }
    return val;
  },
  apply(target, thisArg, argArray) {
    if (!initialized) {
      ensureGSAP();
    }
    return Reflect.apply(target, thisArg, argArray);
  },
});

const scrollTriggerProxy = new Proxy(ScrollTrigger, {
  get(target, prop, receiver) {
    if (!initialized) {
      ensureGSAP();
    }
    const val = Reflect.get(target, prop, receiver);
    if (typeof val === "function") {
      return val.bind(target);
    }
    return val;
  },
});

export { gsapProxy as gsap, scrollTriggerProxy as ScrollTrigger, TextPlugin, Flip };
export default gsapProxy;
