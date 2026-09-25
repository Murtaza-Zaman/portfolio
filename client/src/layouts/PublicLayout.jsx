/**
 * PublicLayout — root shell for all public pages.
 * Wires in the global motion system:
 *   • Lenis smooth scroll (desktop only)
 *   • GSAP ScrollProgress bar (top stripe)
 *   • CustomCursor (desktop only)
 *   • @gsap/react context for auto-cleanup
 */

import { Outlet } from "react-router-dom";

// Initialize GSAP plugins ONCE at module load time
import "../lib/gsap";

import { AICursor } from "../components/Cursor";
import { SentientUniverseBackground } from "../components/Background";
import { SiteFooter } from "../components/common/SiteFooter";
import { SiteHeader } from "../components/common/SiteHeader";
import { WhatsAppButton } from "../components/common/WhatsAppButton";
import { ScrollProgress } from "../components/common/ScrollProgress";
import { LenisProvider } from "../lib/LenisProvider";


export function PublicLayout() {
  return (
    <LenisProvider>
      <div className="relative flex min-h-screen flex-col bg-[#050c1a] text-slate-100">
        {/* ── Sentient Engineering Universe Background ──────────────── */}
        <SentientUniverseBackground />

        {/* Intelligent AI Cursor */}
        <AICursor />

        {/* Global UI overlays */}
        <ScrollProgress />

        {/* Skip to main content — accessibility */}
        <a
          className="absolute left-4 top-4 z-30 -translate-y-20 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
          href="#main-content"
        >
          Skip to content
        </a>

        <SiteHeader />

        <main className="flex-1" id="main-content">
          <Outlet />
        </main>

        <SiteFooter />
        <WhatsAppButton />
      </div>
    </LenisProvider>
  );
}
