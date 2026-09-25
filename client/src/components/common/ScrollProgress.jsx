/**
 * ScrollProgress — a thin teal bar pinned to the top of the viewport
 * that fills from left to right as the user scrolls down the page.
 * Uses GSAP ScrollTrigger scrub for precise sync.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";

export function ScrollProgress() {
  const barRef = useRef(null);

  useGSAP(() => {
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9997] h-[3px] w-full origin-left"
      style={{ transformOrigin: "left center" }}
    >
      <div
        ref={barRef}
        className="h-full w-full bg-gradient-to-r from-teal-500 to-teal-300"
        style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
      />
    </div>
  );
}
