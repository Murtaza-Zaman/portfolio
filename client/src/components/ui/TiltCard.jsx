/**
 * TiltCard — CSS 3D tilt effect on mouse move.
 * - Disabled on touch devices and reduced-motion
 * - Max tilt: 8 degrees
 * - Returns to flat on mouse leave with spring easing
 */
import { useRef, useCallback } from "react";

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

function isReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TiltCard({ children, className = "", maxTilt = 8, ...props }) {
  const cardRef = useRef(null);
  const frameRef = useRef(null);
  const disabled = isTouchDevice() || isReducedMotion();

  const handleMouseMove = useCallback(
    (e) => {
      if (disabled) return;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -maxTilt;
        const rotateY = ((x - cx) / cx) * maxTilt;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });
    },
    [disabled, maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    cancelAnimationFrame(frameRef.current);
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    setTimeout(() => {
      if (card) card.style.transition = "";
    }, 500);
  }, [disabled]);

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      {...props}
    >
      {children}
    </div>
  );
}
