/**
 * CustomCursor — a two-ring cursor: a fast dot (position) + a slower ring (lag).
 * - Magnetic pull on [data-magnetic] elements
 * - Scale-up on links/buttons ([data-cursor="link"], a, button, input, select)
 * - Hidden on touch-primary devices and respects prefers-reduced-motion
 * - Auto-hides when mouse leaves viewport
 */

import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";

function isTouchPrimary() {
  return (
    typeof window !== "undefined" &&
    (window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
}

export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const visible = useRef(false);

  useEffect(() => {
    if (isTouchPrimary()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Initial hide
    gsap.set([dot, ring], { opacity: 0, xPercent: -50, yPercent: -50 });

    let mx = 0,
      my = 0;
    let hoveredMagneticEl = null;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;

      if (!visible.current) {
        visible.current = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
      }

      // Dot follows instantly
      gsap.set(dot, { x: mx, y: my });
      // Ring lags slightly
      gsap.to(ring, { x: mx, y: my, duration: 0.12, ease: "none" });

      // Handle magnetic pull
      const magneticTarget = e.target.closest?.("[data-magnetic]");
      if (magneticTarget) {
        hoveredMagneticEl = magneticTarget;
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = mx - centerX;
        const dy = my - centerY;

        gsap.to(magneticTarget, {
          x: dx * 0.25,
          y: dy * 0.25,
          duration: 0.25,
          ease: "power2.out",
        });
      } else if (hoveredMagneticEl) {
        gsap.to(hoveredMagneticEl, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.4)",
        });
        hoveredMagneticEl = null;
      }
    };

    const onOver = (e) => {
      const interactive = e.target.closest?.(
        'a, button, [data-cursor="link"], [data-magnetic], input[type="submit"], input[type="button"], select, label[for]'
      );
      if (interactive) {
        gsap.to(ring, { scale: 2.2, duration: 0.25, ease: "power2.out" });
      }
    };

    const onOut = (e) => {
      const interactive = e.target.closest?.(
        'a, button, [data-cursor="link"], [data-magnetic], input[type="submit"], input[type="button"], select, label[for]'
      );
      if (interactive) {
        gsap.to(ring, { scale: 1, duration: 0.25, ease: "power2.out" });
      }
    };

    const onLeave = () => {
      visible.current = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
      if (hoveredMagneticEl) {
        gsap.to(hoveredMagneticEl, { x: 0, y: 0, duration: 0.4 });
        hoveredMagneticEl = null;
      }
    };

    const onEnter = () => {
      if (visible.current) return;
      visible.current = true;
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (hoveredMagneticEl) {
        gsap.to(hoveredMagneticEl, { x: 0, y: 0, duration: 0.2 });
      }
    };
  }, []);

  if (typeof window !== "undefined" && isTouchPrimary()) return null;

  return (
    <>
      {/* Fast dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-teal-400 mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      {/* Lagging ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 rounded-full border border-teal-400/60 mix-blend-difference"
        style={{ willChange: "transform" }}
      />
    </>
  );
}

