/**
 * DeepSpaceAtmosphere — Layer 1
 *
 * Cosmic engineering atmosphere with slow-breathing cyan, teal, and indigo
 * plasma energy fields. GPU-accelerated with multi-layered celestial aurora.
 */

import { memo } from "react";

export const DeepSpaceAtmosphere = memo(function DeepSpaceAtmosphere() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── Base Midnight Navy Canvas ─────────────────────────────── */}
      <div className="absolute inset-0 bg-[#050c1a]" />

      {/* ── Plasma Field 1: Cyan Electromagnetic Glow (Top-Left) ──── */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[75vw] h-[75vw] max-w-[1000px] max-h-[1000px] rounded-full blur-[120px] opacity-45 animate-pulse-slow pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(6,182,212,0.08) 45%, rgba(14,165,233,0.03) 70%, transparent 85%)",
          animationDuration: "32s",
        }}
      />

      {/* ── Plasma Field 2: Cosmic Indigo / Hyper-Violet Haze (Top-Right) ── */}
      <div
        className="absolute top-[5%] -right-[15%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full blur-[140px] opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.08) 50%, transparent 80%)",
          animation: "floatSlow 44s ease-in-out infinite alternate",
        }}
      />

      {/* ── Plasma Field 3: Electric Mint / Aurora Teal (Center-Bottom) ─ */}
      <div
        className="absolute -bottom-[20%] left-[15%] w-[75vw] h-[65vw] max-w-[1000px] max-h-[900px] rounded-full blur-[130px] opacity-35 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.16) 0%, rgba(6,182,212,0.06) 50%, transparent 80%)",
          animation: "floatSlow 38s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* ── Plasma Field 4: Deep Interstellar Pulse (Center Floating) ── */}
      <div
        className="absolute top-[35%] left-[30%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full blur-[150px] opacity-25 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(99,102,241,0.05) 55%, transparent 80%)",
          animation: "floatSlow 52s ease-in-out infinite alternate",
        }}
      />

      {/* ── Micro Precision Dot Matrix Grid Overlay ────────────────── */}
      <div className="absolute inset-0 bg-grid-navy opacity-40" />

      {/* ── Subtle Vignette Ring ────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 45%, rgba(5,12,26,0.7) 100%)",
        }}
      />
    </div>
  );
});

export default DeepSpaceAtmosphere;
