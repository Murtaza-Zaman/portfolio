/**
 * RouteFallback.jsx — High-end Quantum Singularity Route Suspense Fallback
 * Includes the living Sentient Universe Background animation from the main screens.
 */

import { SentientUniverseBackground } from "../Background";

export function RouteFallback() {
  return (
    <div
      aria-live="polite"
      role="status"
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-[#050c1a] px-6 py-20 text-slate-100 overflow-hidden"
    >
      {/* ── Living Digital Universe Background from Main Screens ── */}
      <SentientUniverseBackground />

      {/* Mini Singularity Core */}
      <div className="relative z-10 flex h-12 w-12 items-center justify-center">
        {/* Outer pulsing energy rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-40" />
        <div className="absolute inset-1 rounded-full border border-teal-400/40 animate-spin [animation-duration:3s]" />
        <div className="absolute inset-2.5 rounded-full border border-violet-500/40 animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />

        {/* Central glowing singularity */}
        <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00e5ff]" />
      </div>

      {/* Cybernetic Telemetry */}
      <div className="relative z-10 flex flex-col items-center gap-1 text-center">
        <span className="font-mono text-xs font-semibold tracking-widest text-cyan-400 uppercase">
          SYNCHRONIZING WORKSPACE
        </span>
        <span className="font-mono text-[10px] tracking-wider text-slate-500">
          GENESIS CORE // SYSTEM ACTIVE
        </span>
      </div>
    </div>
  );
}