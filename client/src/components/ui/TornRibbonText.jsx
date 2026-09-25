/**
 * TornRibbonText — Complete Fully Reusable Editorial Typography Component
 * with Physics-Driven Letter-Drop Effect.
 *
 * Capabilities:
 * - 100% pixel-perfect idle visual fidelity with torn-paper deckle edges & cyan ribbon.
 * - Physics-driven letter drag & drop with weighted gravity lag, angular swing tilt, and elastic snap-back.
 * - Fully configurable: supports singleLine, line1/line2, or arbitrary lines array.
 * - Customizable colors, typography, script tags, physics tuning, and event hooks.
 * - Safe for SSR and responsive down to mobile viewports with zero layout shift.
 */

import { memo, useState, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";

// The ribbon polygon slicing across the name diagonally (~-10deg)
export const DEFAULT_RIBBON_CLIP_PATH = `polygon(
  -5% 42%, 0% 41.2%, 3% 42.5%, 6% 40.5%, 9% 41.8%, 12% 39.5%, 15% 41.0%, 18% 39.0%,
  21% 40.2%, 24% 38.0%, 27% 39.4%, 30% 37.2%, 33% 38.5%, 36% 36.0%, 39% 37.6%, 42% 35.2%,
  45% 36.8%, 48% 34.4%, 51% 35.8%, 54% 33.5%, 57% 35.0%, 60% 32.8%, 63% 34.2%, 66% 31.8%,
  69% 33.4%, 72% 31.0%, 75% 32.5%, 78% 30.0%, 81% 31.6%, 84% 29.2%, 87% 30.8%, 90% 28.5%,
  93% 30.0%, 96% 27.8%, 99% 29.2%, 102% 26.8%, 105% 28.0%,
  105% 66.0%,
  102% 67.5%, 99% 65.5%, 96% 67.0%, 93% 65.0%, 90% 66.6%, 87% 64.4%, 84% 66.2%,
  81% 64.0%, 78% 65.8%, 75% 63.6%, 72% 65.2%, 69% 63.0%, 66% 64.8%, 63% 62.5%, 60% 64.2%,
  57% 62.0%, 54% 63.6%, 51% 61.4%, 48% 63.0%, 45% 60.8%, 42% 62.4%, 39% 60.0%, 36% 61.8%,
  33% 59.5%, 30% 61.2%, 27% 59.0%, 24% 60.6%, 21% 58.4%, 18% 60.0%, 15% 57.8%, 12% 59.4%,
  9% 57.0%, 6% 58.8%, 3% 56.5%, 0% 58.0%, -5% 56.0%
)`;

// SVG path data for the top white torn deckle edge
export const DEFAULT_TOP_TEAR_SVG_PATH =
  "M -5 42 L 0 41.2 L 3 42.5 L 6 40.5 L 9 41.8 L 12 39.5 L 15 41.0 L 18 39.0 L 21 40.2 L 24 38.0 L 27 39.4 L 30 37.2 L 33 38.5 L 36 36.0 L 39 37.6 L 42 35.2 L 45 36.8 L 48 34.4 L 51 35.8 L 54 33.5 L 57 35.0 L 60 32.8 L 63 34.2 L 66 31.8 L 69 33.4 L 72 31.0 L 75 32.5 L 78 30.0 L 81 31.6 L 84 29.2 L 87 30.8 L 90 28.5 L 93 30.0 L 96 27.8 L 99 29.2 L 102 26.8 L 105 28.0";

// SVG path data for the bottom white torn deckle edge
export const DEFAULT_BOTTOM_TEAR_SVG_PATH =
  "M 105 66.0 L 102 67.5 L 99 65.5 L 96 67.0 L 93 65.0 L 90 66.6 L 87 64.4 L 84 66.2 L 81 64.0 L 78 65.8 L 75 63.6 L 72 65.2 L 69 63.0 L 66 64.8 L 63 62.5 L 60 64.2 L 57 62.0 L 54 63.6 L 51 61.4 L 48 63.0 L 45 60.8 L 42 62.4 L 39 60.0 L 36 61.8 L 33 59.5 L 30 61.2 L 27 59.0 L 24 60.6 L 21 58.4 L 18 60.0 L 15 57.8 L 12 59.4 L 9 57.0 L 6 58.8 L 3 56.5 L 0 58.0 L -5 56.0";

/**
 * Interactive Letter Component
 * Renders an individual character with spring-physics dragging and velocity tilt.
 */
export const InteractiveLetter = memo(function InteractiveLetter({
  char,
  letterKey,
  lineIndex = 0,
  charIndex = 0,
  isInteractive = true,
  isDetached = false,
  activeDragKeyRef,
  onDragStart,
  onDragEnd,
  gravity = 22,
  lerpFactor = 0.22,
  maxRotation = 26,
  springDuration = 0.52,
  springEase = "elastic.out(1.15, 0.45)",
}) {
  const elementRef = useRef(null);
  const dragPhysicsRef = useRef({
    isDragging: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    currentRot: 0,
    prevPointerX: 0,
    prevPointerY: 0,
    velocityX: 0,
    rafId: null,
  });

  // Handle pointer down (mouse or touch)
  const handlePointerDown = useCallback(
    (e) => {
      if (!isInteractive) return;
      if (e.button !== 0 && e.pointerType === "mouse") return;
      if (activeDragKeyRef.current !== null) return;

      const el = elementRef.current;
      if (!el) return;

      e.preventDefault();
      e.stopPropagation();

      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback if unsupported
      }

      activeDragKeyRef.current = letterKey;
      if (onDragStart) {
        onDragStart({ letterKey, char, lineIndex, charIndex });
      }

      const phys = dragPhysicsRef.current;
      phys.isDragging = true;
      phys.pointerId = e.pointerId;
      phys.startX = e.clientX;
      phys.startY = e.clientY;
      phys.targetX = 0;
      phys.targetY = gravity;
      phys.currentX = 0;
      phys.currentY = 0;
      phys.currentRot = 0;
      phys.prevPointerX = e.clientX;
      phys.prevPointerY = e.clientY;
      phys.velocityX = 0;

      // Stop any in-flight GSAP return tween
      gsap.killTweensOf(el);

      // Apply detached visual elevation
      el.style.zIndex = "50";
      el.style.cursor = "grabbing";
      el.style.filter = "drop-shadow(0 18px 30px rgba(0, 0, 0, 0.9))";

      // 60FPS physics loop
      const updatePhysics = () => {
        if (!phys.isDragging) return;

        // Weighted inertia lag towards target position + downward gravity
        phys.currentX += (phys.targetX - phys.currentX) * lerpFactor;
        phys.currentY += (phys.targetY - phys.currentY) * lerpFactor;

        // Angular hanging swing based on displacement lag and instantaneous velocity
        const targetRot = Math.max(
          -maxRotation,
          Math.min(
            maxRotation,
            (phys.targetX - phys.currentX) * 0.35 + phys.velocityX * 1.5
          )
        );
        phys.currentRot += (targetRot - phys.currentRot) * 0.18;

        // Velocity damping
        phys.velocityX *= 0.82;

        if (el) {
          el.style.transform = `translate3d(${phys.currentX.toFixed(2)}px, ${phys.currentY.toFixed(2)}px, 0) rotate(${phys.currentRot.toFixed(2)}deg)`;
        }

        phys.rafId = requestAnimationFrame(updatePhysics);
      };

      phys.rafId = requestAnimationFrame(updatePhysics);
    },
    [
      isInteractive,
      letterKey,
      char,
      lineIndex,
      charIndex,
      activeDragKeyRef,
      onDragStart,
      gravity,
      lerpFactor,
      maxRotation,
    ]
  );

  // Handle pointer move
  const handlePointerMove = useCallback(
    (e) => {
      const phys = dragPhysicsRef.current;
      if (!phys.isDragging || phys.pointerId !== e.pointerId) return;

      const deltaX = e.clientX - phys.startX;
      const deltaY = e.clientY - phys.startY + gravity;

      phys.targetX = deltaX;
      phys.targetY = deltaY;

      const instantVx = e.clientX - phys.prevPointerX;
      phys.prevPointerX = e.clientX;
      phys.prevPointerY = e.clientY;
      phys.velocityX = phys.velocityX * 0.4 + instantVx * 0.6;
    },
    [gravity]
  );

  // Handle pointer release / cancellation
  const handlePointerUp = useCallback(
    (e) => {
      const phys = dragPhysicsRef.current;
      if (!phys.isDragging || (phys.pointerId !== null && phys.pointerId !== e.pointerId)) {
        return;
      }

      phys.isDragging = false;
      if (phys.rafId) {
        cancelAnimationFrame(phys.rafId);
        phys.rafId = null;
      }

      const el = elementRef.current;
      if (el) {
        try {
          if (phys.pointerId !== null && el.hasPointerCapture(phys.pointerId)) {
            el.releasePointerCapture(phys.pointerId);
          }
        } catch {
          // ignore
        }

        const prefersReducedMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Elastic overshoot snap-back to origin
        gsap.to(el, {
          x: 0,
          y: 0,
          rotate: 0,
          duration: prefersReducedMotion ? 0.22 : springDuration,
          ease: prefersReducedMotion ? "power2.out" : springEase,
          onComplete: () => {
            if (el) {
              el.style.zIndex = "";
              el.style.cursor = "";
              el.style.filter = "";
              el.style.transform = "";
            }
            activeDragKeyRef.current = null;
            if (onDragEnd) {
              onDragEnd({ letterKey, char, lineIndex, charIndex });
            }
          },
        });
      } else {
        activeDragKeyRef.current = null;
        if (onDragEnd) {
          onDragEnd({ letterKey, char, lineIndex, charIndex });
        }
      }
    },
    [letterKey, char, lineIndex, charIndex, activeDragKeyRef, onDragEnd, springDuration, springEase]
  );

  // Safety fallback for window pointer release
  useEffect(() => {
    const phys = dragPhysicsRef.current;
    const onWindowPointerUp = (e) => {
      if (phys.isDragging && phys.pointerId === e.pointerId) {
        handlePointerUp(e);
      }
    };

    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);

    return () => {
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
      if (phys.rafId) {
        cancelAnimationFrame(phys.rafId);
      }
    };
  }, [handlePointerUp]);

  // Non-breaking space preservation
  if (char === " ") {
    return <span className="inline-block">&nbsp;</span>;
  }

  // Hide ribbon slice copy while letter is detached
  const ribbonOpacityStyle = !isInteractive && isDetached ? { opacity: 0 } : {};

  return (
    <span
      ref={elementRef}
      onPointerDown={isInteractive ? handlePointerDown : undefined}
      onPointerMove={isInteractive ? handlePointerMove : undefined}
      onPointerUp={isInteractive ? handlePointerUp : undefined}
      onPointerCancel={isInteractive ? handlePointerUp : undefined}
      className={`inline-block relative select-none ${
        isInteractive
          ? "cursor-grab active:cursor-grabbing hover:brightness-110"
          : "pointer-events-none"
      }`}
      style={{
        touchAction: isInteractive ? "none" : undefined,
        willChange: isInteractive ? "transform" : undefined,
        ...ribbonOpacityStyle,
      }}
      aria-hidden="true"
    >
      {char}
    </span>
  );
});

/**
 * TornRibbonText — Primary Reusable Component
 */
export const TornRibbonText = memo(function TornRibbonText({
  // Text inputs (flexible formats)
  line1 = "MURTAZA",
  line2 = "ZAMAN",
  lines,
  singleLine,
  text,

  // Script Tag config
  scriptTag = "Full-Stack Engineer",
  scriptTagColor = "text-teal-300",
  scriptTagClass = "",
  showScriptTag = true,

  // Typography & Styling
  fontFamily = "'League Gothic', Impact, sans-serif",
  fontSize = "text-[clamp(60px,11vw,136px)]",
  lineHeight = 0.86,
  letterSpacing = "0.015em",
  textColor = "text-slate-100",
  ribbonTextColor = "text-cyan-400",
  ribbonBg = "bg-[#060a14]",
  glowColor = "rgba(6, 182, 212, 0.45)",
  showTornRibbon = true,
  ribbonClipPath = DEFAULT_RIBBON_CLIP_PATH,
  topTearPath = DEFAULT_TOP_TEAR_SVG_PATH,
  bottomTearPath = DEFAULT_BOTTOM_TEAR_SVG_PATH,

  // Physics & Interaction tuning
  interactive = true,
  gravity = 22,
  lerpFactor = 0.22,
  maxRotation = 26,
  springDuration = 0.52,
  springEase = "elastic.out(1.15, 0.45)",
  onLetterDragStart,
  onLetterDragEnd,

  // Component Props
  as: Component = "div",
  role = "heading",
  ariaLevel = 1,
  className = "",
  style = {},
  ariaLabel,
}) {
  // Normalize text lines
  let resolvedLines = [];
  if (Array.isArray(lines) && lines.length > 0) {
    resolvedLines = lines;
  } else if (singleLine) {
    resolvedLines = [singleLine];
  } else if (text) {
    resolvedLines = typeof text === "string" ? text.split("\n") : [String(text)];
  } else {
    resolvedLines = [line1, line2].filter(Boolean);
  }

  const label = ariaLabel || resolvedLines.join(" ");

  // Shared active letter tracking so only 1 letter can drag at a time
  const activeDragKeyRef = useRef(null);
  const [activeLetterKey, setActiveLetterKey] = useState(null);

  const handleDragStart = useCallback(
    (data) => {
      setActiveLetterKey(data.letterKey);
      if (onLetterDragStart) {
        onLetterDragStart(data);
      }
    },
    [onLetterDragStart]
  );

  const handleDragEnd = useCallback(
    (data) => {
      setActiveLetterKey((prev) => (prev === data.letterKey ? null : prev));
      if (onLetterDragEnd) {
        onLetterDragEnd(data);
      }
    },
    [onLetterDragEnd]
  );

  const renderTextContent = (customTextColor = "", isInteractive = true) => {
    const lineStyle = {
      fontFamily,
      lineHeight,
      letterSpacing,
    };

    const lineClass = `block uppercase select-none tracking-[0.015em] leading-[0.86] ${fontSize} ${customTextColor}`;

    const splitIntoLetters = (lineStr, lineIdx) => {
      return lineStr.split("").map((char, charIdx) => {
        const key = `l${lineIdx}-c${charIdx}-${char}`;
        return (
          <InteractiveLetter
            key={key}
            char={char}
            letterKey={key}
            lineIndex={lineIdx}
            charIndex={charIdx}
            isInteractive={isInteractive && interactive}
            isDetached={activeLetterKey === key}
            activeDragKeyRef={activeDragKeyRef}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            gravity={gravity}
            lerpFactor={lerpFactor}
            maxRotation={maxRotation}
            springDuration={springDuration}
            springEase={springEase}
          />
        );
      });
    };

    if (resolvedLines.length === 1) {
      return (
        <span className={lineClass} style={lineStyle}>
          {splitIntoLetters(resolvedLines[0], 0)}
        </span>
      );
    }

    return (
      <div className="flex flex-col">
        {resolvedLines.map((lineText, idx) => (
          <span
            key={idx}
            className={`${lineClass} ${idx > 0 ? "-mt-[0.02em]" : ""}`}
            style={lineStyle}
          >
            {splitIntoLetters(lineText, idx)}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Component
      className={`relative inline-block select-none overflow-visible ${className}`}
      style={style}
      aria-label={label}
      role={role}
      aria-level={role === "heading" ? ariaLevel : undefined}
    >
      {/* ── 1. Top-Left Casual Handwritten Script Tag ──────────────── */}
      {showScriptTag && scriptTag && (
        <span
          className={`absolute -top-5 left-1 sm:-top-6 sm:left-2 md:-top-8 md:left-2.5 z-20 pointer-events-none font-script text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-bold -rotate-6 tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] whitespace-nowrap ${scriptTagColor} ${scriptTagClass}`}
          style={{
            textShadow: "0 0 16px rgba(45, 212, 191, 0.4)",
          }}
          aria-hidden="true"
        >
          {scriptTag}
        </span>
      )}

      {/* ── 2. Layer 1: Base Solid White / Silver Text (Interactive) ─ */}
      <div
        className={`relative z-[1] ${textColor}`}
        aria-hidden="true"
      >
        {renderTextContent(textColor, true)}
      </div>

      {/* ── 3. Layer 2: Dark Torn Ribbon with Contrasting Electric Cyan Text ─ */}
      {showTornRibbon && (
        <div
          className={`absolute -inset-x-2 inset-y-0 z-[2] pointer-events-none ${ribbonBg} shadow-2xl`}
          style={{
            clipPath: ribbonClipPath,
          }}
          aria-hidden="true"
        >
          <div
            className="relative w-full h-full px-2 pointer-events-none"
            style={{
              filter: `drop-shadow(0 0 10px ${glowColor})`,
            }}
          >
            {renderTextContent(ribbonTextColor, false)}
          </div>
        </div>
      )}

      {/* ── 4. Layer 3: Realistic White Deckle Edge Lines (Top & Bottom only) ─ */}
      {showTornRibbon && (
        <svg
          className="absolute -inset-x-2 inset-y-0 w-[calc(100%+1rem)] h-full z-[3] pointer-events-none overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter id="torn-edge-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Top White Torn Paper Deckle Edge */}
          <path
            d={topTearPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#torn-edge-shadow)"
          />

          {/* Bottom White Torn Paper Deckle Edge */}
          <path
            d={bottomTearPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#torn-edge-shadow)"
          />
        </svg>
      )}

      {/* ── 5. Hidden Accessible Screen Reader Text ─────────────────── */}
      <span className="sr-only">{label}</span>
    </Component>
  );
});

export default TornRibbonText;
