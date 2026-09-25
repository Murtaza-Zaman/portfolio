/**
 * useSplitTextAnimation — Centralized GSAP SplitText Animation Hook
 *
 * Implements the 5 core typography categories:
 * 1. HERO HEADLINES   (.text-hero, variant="hero")     — 3D character rise with blur reveal
 * 2. SECTION HEADINGS (.text-heading, variant="heading") — Crisp character rise
 * 3. PROJECT TITLES   (.text-project, variant="project") — Slot machine drop from above with elastic back
 * 4. SMALL TECH LABELS (.text-label, variant="label")   — Fast terminal character boot
 * 5. BODY TEXT        (.text-body, variant="body")     — Word-based upward fade
 *
 * Performance:
 * - GSAP ScrollTrigger with start: "top 85%", once: true
 * - Responsive matchMedia (<768px disables 3D rotation, reduces distance for 120 FPS)
 * - Prefers-reduced-motion support
 * - Zero memory leaks via gsap.context()
 */

import { useLayoutEffect, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

// Universal isomorphic layout effect
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Configure and animate split text elements
 * @param {Object} options
 * @param {React.RefObject} [options.targetRef] - Specific container or element ref
 * @param {'hero'|'heading'|'project'|'label'|'body'} [options.variant='heading']
 * @param {boolean} [options.scrollTrigger=true] - Trigger on scroll entry
 * @param {string} [options.triggerStart='top 85%'] - ScrollTrigger start position
 * @param {number} [options.delay=0] - Additional animation delay
 * @param {boolean} [options.autoRun=true] - Automatically execute on mount
 * @param {boolean} [options.scanClasses=false] - Auto-scan children for .text-* classes
 */
export function useSplitTextAnimation({
  targetRef,
  variant = "heading",
  scrollTrigger = true,
  triggerStart = "top 85%",
  delay = 0,
  autoRun = true,
  scanClasses = false,
} = {}) {
  const containerRef = useRef(null);
  const activeRef = targetRef || containerRef;

  useIsomorphicLayoutEffect(() => {
    const el = activeRef.current;
    if (!el || !autoRun) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion =
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

      // Helper to animate a single group of split characters or words
      const animateSplitGroup = (container, type, customDelay = 0) => {
        if (prefersReducedMotion) {
          gsap.set(container.querySelectorAll(".split-char, .split-word"), {
            opacity: 1,
            yPercent: 0,
            y: 0,
            x: 0,
            rotationX: 0,
            filter: "blur(0px)",
          });
          return;
        }

        const isWordBased = type === "body";
        const targets = container.querySelectorAll(
          isWordBased ? ".split-word" : ".split-char"
        );

        if (!targets.length) {
          // If not split, animate container itself as fallback
          gsap.fromTo(
            container,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, delay: customDelay, ease: "power3.out" }
          );
          return;
        }

        const mm = gsap.matchMedia();

        // ── Desktop Animation (>= 768px) ──
        mm.add("(min-width: 768px)", () => {
          let fromVars = {};
          let toVars = {};

          switch (type) {
            case "hero":
              // 1. HERO HEADLINES: Crisp character rise
              fromVars = {
                yPercent: 70,
                opacity: 0,
              };
              toVars = {
                yPercent: 0,
                opacity: 1,
                duration: 0.85,
                ease: "power3.out",
                stagger: 0.02,
                delay: customDelay,
                clearProps: "filter,willChange",
              };
              break;

            case "heading":
              // 2. SECTION HEADINGS: Crisp character rise
              fromVars = {
                yPercent: 50,
                opacity: 0,
              };
              toVars = {
                yPercent: 0,
                opacity: 1,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.025,
                delay: customDelay,
                clearProps: "filter,willChange",
              };
              break;

            case "project":
              // 3. PROJECT TITLES: Clean smooth drop from above
              fromVars = {
                yPercent: -80,
                opacity: 0,
              };
              toVars = {
                yPercent: 0,
                opacity: 1,
                duration: 0.75,
                ease: "power3.out",
                stagger: 0.02,
                delay: customDelay,
                clearProps: "filter,willChange",
              };
              break;

            case "label":
              // 4. SMALL TECH LABELS: Fast clean character fade
              fromVars = {
                opacity: 0,
                y: 10,
              };
              toVars = {
                opacity: 1,
                y: 0,
                duration: 0.35,
                ease: "power2.out",
                stagger: 0.015,
                delay: customDelay,
                clearProps: "filter,willChange",
              };
              break;

            case "body":
            default:
              // 5. BODY TEXT: Word-based upward fade
              fromVars = {
                opacity: 0,
                y: 16,
              };
              toVars = {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: "power3.out",
                stagger: 0.02,
                delay: customDelay,
                clearProps: "filter,willChange",
              };
              break;
          }

          if (scrollTrigger) {
            ScrollTrigger.create({
              trigger: container,
              start: triggerStart,
              once: true,
              onEnter: () => {
                gsap.fromTo(targets, fromVars, toVars);
              },
            });
          } else {
            gsap.fromTo(targets, fromVars, toVars);
          }
        });

        // ── Mobile Animation (< 768px): Optimized performance ──
        mm.add("(max-width: 767px)", () => {
          let fromVars = {};
          let toVars = {};

          switch (type) {
            case "hero":
              fromVars = { yPercent: 40, opacity: 0 };
              toVars = {
                yPercent: 0,
                opacity: 1,
                duration: 0.65,
                ease: "power3.out",
                stagger: 0.015,
                delay: customDelay,
                clearProps: "filter,willChange",
              };
              break;

            case "heading":
              fromVars = { yPercent: 35, opacity: 0 };
              toVars = {
                yPercent: 0,
                opacity: 1,
                duration: 0.55,
                ease: "power3.out",
                stagger: 0.015,
                delay: customDelay,
                clearProps: "filter,willChange",
              };
              break;

            case "project":
              fromVars = { yPercent: -40, opacity: 0 };
              toVars = {
                yPercent: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.015,
                delay: customDelay,
                clearProps: "filter,willChange",
              };
              break;

            case "label":
              fromVars = { opacity: 0, y: 8 };
              toVars = {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
                stagger: 0.012,
                delay: customDelay,
                clearProps: "filter,willChange",
              };
              break;

            case "body":
            default:
              fromVars = { opacity: 0, y: 12 };
              toVars = {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.015,
                delay: customDelay,
                clearProps: "filter,willChange",
              };
              break;
          }

          if (scrollTrigger) {
            ScrollTrigger.create({
              trigger: container,
              start: triggerStart,
              once: true,
              onEnter: () => {
                gsap.fromTo(targets, fromVars, toVars);
              },
            });
          } else {
            gsap.fromTo(targets, fromVars, toVars);
          }
        });
      };

      // If scanClasses is true, scan all child elements with .text-* classes
      if (scanClasses) {
        const classMappings = [
          { selector: ".text-hero", type: "hero" },
          { selector: ".text-heading", type: "heading" },
          { selector: ".text-project", type: "project" },
          { selector: ".text-label", type: "label" },
          { selector: ".text-body", type: "body" },
        ];

        classMappings.forEach(({ selector, type }) => {
          const elements = el.querySelectorAll(selector);
          elements.forEach((item, idx) => {
            animateSplitGroup(item, type, delay + idx * 0.05);
          });
        });
      } else {
        // Otherwise animate the element itself
        animateSplitGroup(el, variant, delay);
      }
    }, el);

    return () => ctx.revert();
  }, [variant, scrollTrigger, triggerStart, delay, autoRun, scanClasses]);

  return { ref: activeRef };
}

export default useSplitTextAnimation;
