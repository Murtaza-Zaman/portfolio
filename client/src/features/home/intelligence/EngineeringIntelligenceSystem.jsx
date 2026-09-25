import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../../lib/gsap";

import { SystemsEngineeredNode } from "./SystemsEngineeredNode";
import { EngineeringEvolutionNode } from "./EngineeringEvolutionNode";
import { TechnologyConstellationNode } from "./TechnologyConstellationNode";
import { ArchitectureMindsetNode } from "./ArchitectureMindsetNode";
import { TextReveal } from "../../../components/animations/TextReveal";
import { useShowcaseCards } from "../../../hooks/usePublicContent";

export function EngineeringIntelligenceSystem() {
  const containerRef = useRef(null);
  const showcaseQuery = useShowcaseCards();

  // Resolve CMS data — array of 4 cards sorted by displayOrder, or empty
  const cmsCards = (() => {
    const raw = showcaseQuery.data?.data ?? showcaseQuery.data ?? [];
    if (!Array.isArray(raw) || raw.length === 0) return [];
    return [...raw].sort((a, b) => a.displayOrder - b.displayOrder);
  })();

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(container.querySelectorAll("[data-intel-node]"), { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      container.querySelectorAll("[data-intel-node]"),
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative border-y border-white/[0.08] bg-transparent py-16 lg:py-20 overflow-hidden"
      data-cursor="service"
    >
      {/* Ambient background glow accents */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 90% 100%, rgba(244,63,94,0.06) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* System HUD Status Header */}
        <div className="flex flex-col gap-3 pb-8 border-b border-white/[0.06] sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-cyan-400 uppercase">
                SYSTEM.SPEC // ARCHITECTURE MATRIX
              </p>
            </div>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              <TextReveal as="span" variant="hero">
                Engineering Intelligence System
              </TextReveal>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Designing, architecting, and deploying resilient software systems, intelligent AI pipelines, and enterprise-grade web experiences.
            </p>
          </div>

          {/* Real-time System Metrics Readout */}
          <div className="flex items-center text-[10px] font-mono text-slate-400 self-start sm:self-auto">
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 flex items-center gap-2">
              <span className="text-slate-500">SYS.STATUS:</span>
              <span className="text-cyan-400 font-semibold">NOMINAL</span>
            </div>
          </div>
        </div>

        {/* 4 Connected Capability Nodes Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div data-intel-node style={{ opacity: 0 }}>
            <SystemsEngineeredNode data={cmsCards[0] || null} />
          </div>
          <div data-intel-node style={{ opacity: 0 }}>
            <EngineeringEvolutionNode data={cmsCards[1] || null} />
          </div>
          <div data-intel-node style={{ opacity: 0 }}>
            <TechnologyConstellationNode data={cmsCards[2] || null} />
          </div>
          <div data-intel-node style={{ opacity: 0 }}>
            <ArchitectureMindsetNode data={cmsCards[3] || null} />
          </div>
        </div>
      </div>
    </section>
  );
}
