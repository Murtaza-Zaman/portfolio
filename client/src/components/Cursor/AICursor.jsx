import { useEffect, useRef, useState } from "react";
import { cursorState } from "./CursorState";
import { CursorParticles } from "./CursorParticles";
import { CursorTrail } from "./CursorTrail";
import { CursorEffects } from "./CursorEffects";

export function AICursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState(cursorState.mode);
  const [label, setLabel] = useState(cursorState.label);

  const orbRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const isSupported = cursorState.init();
    if (!isSupported) return;

    setEnabled(true);
    document.documentElement.classList.add("ai-cursor-active");

    const unsubscribe = cursorState.subscribe((state) => {
      setMode(state.mode);
      setLabel(state.label);
    });

    // Handle interactive element inspection and magnetic pull
    let hoveredMagneticEl = null;

    const onPointerOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      // 1. Primary CTA button
      const ctaBtn = target.closest(
        'button[type="submit"], [data-cursor="button"], [data-magnetic], a[data-magnetic]'
      );
      if (ctaBtn) {
        cursorState.setMode("button", "INITIALIZE");
        return;
      }

      // 2. Project Card
      const projectCard = target.closest('[data-cursor="project"]');
      if (projectCard) {
        cursorState.setMode("project", "VIEW SYSTEM");
        return;
      }

      // 3. Service Card
      const serviceCard = target.closest('[data-cursor="service"]');
      if (serviceCard) {
        cursorState.setMode("service", "CAPABILITY");
        return;
      }

      // 4. Hero Section
      const heroSec = target.closest('[data-cursor="hero"]');
      if (heroSec) {
        cursorState.setMode("hero", "");
        return;
      }

      // 5. Standard Text Links
      const textLink = target.closest("a, button, input, select");
      if (textLink) {
        cursorState.setMode("text", "");
        return;
      }

      cursorState.setMode("default", "");
    };

    const onPointerMove = (e) => {
      const magneticTarget = e.target?.closest?.("[data-magnetic]");
      if (magneticTarget) {
        hoveredMagneticEl = magneticTarget;
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (e.clientX - centerX) * 0.22;
        const dy = (e.clientY - centerY) * 0.22;

        cursorState.setMagnetic(magneticTarget, -dx * 0.4, -dy * 0.4);
        magneticTarget.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      } else if (hoveredMagneticEl) {
        hoveredMagneticEl.style.transform = "translate3d(0, 0, 0)";
        hoveredMagneticEl = null;
        cursorState.clearMagnetic();
      }
    };

    window.addEventListener("mouseover", onPointerOver, { passive: true });
    window.addEventListener("mousemove", onPointerMove, { passive: true });

    // 60 FPS DOM Transform Loop for the Orb
    const updateOrb = () => {
      if (orbRef.current) {
        if (cursorState.isVisible) {
          orbRef.current.style.opacity = "1";
          orbRef.current.style.transform = `translate3d(${cursorState.x}px, ${cursorState.y}px, 0) translate(-50%, -50%)`;
        } else {
          orbRef.current.style.opacity = "0";
        }
      }
      animFrameRef.current = requestAnimationFrame(updateOrb);
    };

    animFrameRef.current = requestAnimationFrame(updateOrb);

    return () => {
      document.documentElement.classList.remove("ai-cursor-active");
      window.removeEventListener("mouseover", onPointerOver);
      window.removeEventListener("mousemove", onPointerMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      unsubscribe();
      cursorState.destroy();
    };
  }, []);

  if (!enabled) return null;

  // Determine appearance based on active mode
  const isCapsule = mode === "project" || mode === "button";
  const isText = mode === "text";
  const isThinking = mode === "thinking";

  return (
    <>
      {/* Particle trail and physics canvas */}
      <CursorParticles />
      <CursorTrail />
      <CursorEffects />

      {/* Main Intelligent Glass Orb */}
      <div
        ref={orbRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 transition-opacity duration-200"
        style={{ willChange: "transform" }}
      >
        {isCapsule ? (
          // Expanded Glass Capsule for Interactive Elements (Projects, CTA Buttons)
          <div className="flex items-center gap-2 rounded-full border border-cyan-400/50 bg-[#050c1a]/80 px-3.5 py-1.5 shadow-[0_0_20px_rgba(6,182,212,0.35)] backdrop-blur-md transition-all duration-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-cyan-300 whitespace-nowrap uppercase">
              {label}
            </span>
          </div>
        ) : isThinking ? (
          // AI Thinking Mode Center
          <div className="flex flex-col items-center">
            <div className="relative flex h-3 w-3 items-center justify-center rounded-full border border-cyan-400/60 bg-white/[0.08] shadow-[0_0_14px_rgba(6,182,212,0.5)] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <span className="mt-7 font-mono text-[9px] font-semibold tracking-[0.2em] text-cyan-400/80 uppercase whitespace-nowrap animate-pulse">
              AI THINKING...
            </span>
          </div>
        ) : isText ? (
          // Subtle Magnetic Text Ring
          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.25)] backdrop-blur-sm transition-all duration-200">
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
          </div>
        ) : (
          // Default Minimal Futuristic Glass Orb (8px - 12px)
          <div className="group relative flex h-3 w-3 items-center justify-center rounded-full border border-cyan-400/40 bg-white/[0.06] shadow-[0_0_12px_rgba(6,182,212,0.3)] backdrop-blur-[4px] transition-all duration-200">
            {/* Specular glass reflection */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-60" />
            {/* Living, pulsing AI core */}
            <span className="relative h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4] animate-pulse" />
          </div>
        )}
      </div>
    </>
  );
}
