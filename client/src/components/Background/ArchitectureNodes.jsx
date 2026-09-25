/**
 * ArchitectureNodes — Layer 3
 *
 * Floating holographic architecture nodes representing:
 * - Frontend Architecture (React 19, Vite)
 * - Cloud & Microservices (AWS, Docker)
 * - AI Intelligence (LLM Integrations, Neural Pipelines)
 * - Distributed Backend (Node.js, Express)
 * - High-Throughput Data (MongoDB Atlas, Redis)
 * - Search & Growth (Technical SEO & GEO)
 *
 * Subtle, unobtrusive glassmorphism with 3D orbital drift and mouse parallax.
 */

import { memo, useEffect, useRef } from "react";
import { Cpu, Cloud, Database, Globe, Layers, Server } from "lucide-react";

const NODES_DATA = [
  {
    id: "node-frontend",
    label: "FRONTEND CORE",
    sublabel: "React 19 // Component Systems",
    icon: Layers,
    pos: { top: "14%", left: "6%" },
    depth: 0.6,
  },
  {
    id: "node-cloud",
    label: "CLOUD INFRASTRUCTURE",
    sublabel: "Distributed Microservices",
    icon: Cloud,
    pos: { top: "28%", right: "7%" },
    depth: 0.8,
  },
  {
    id: "node-ai",
    label: "NEURAL ENGINE",
    sublabel: "AI & LLM Pipeline Architecture",
    icon: Cpu,
    pos: { top: "54%", left: "5%" },
    depth: 0.5,
  },
  {
    id: "node-backend",
    label: "ASYNC RUNTIME",
    sublabel: "Node.js // Event Bus & APIs",
    icon: Server,
    pos: { top: "68%", right: "8%" },
    depth: 0.7,
  },
  {
    id: "node-database",
    label: "DATA CLUSTER",
    sublabel: "MongoDB Atlas // Redis Cache",
    icon: Database,
    pos: { bottom: "16%", left: "10%" },
    depth: 0.55,
  },
  {
    id: "node-seo",
    label: "DISCOVERY ENGINE",
    sublabel: "Technical SEO // GEO Structured",
    icon: Globe,
    pos: { bottom: "12%", right: "9%" },
    depth: 0.75,
  },
];

export const ArchitectureNodes = memo(function ArchitectureNodes() {
  const containerRef = useRef(null);

  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (isReduced) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    const onPointerMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 35;
      mouseY = (e.clientY / innerHeight - 0.5) * 35;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const animateParallax = () => {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      if (containerRef.current) {
        const nodes = containerRef.current.querySelectorAll("[data-arch-node]");
        nodes.forEach((el) => {
          const depth = parseFloat(el.getAttribute("data-depth") || "0.5");
          const tx = currentX * depth;
          const ty = currentY * depth;
          el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
        });
      }

      rafId = requestAnimationFrame(animateParallax);
    };

    rafId = requestAnimationFrame(animateParallax);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 hidden lg:block"
      aria-hidden="true"
    >
      {NODES_DATA.map((node) => {
        const IconComponent = node.icon;
        return (
          <div
            key={node.id}
            data-arch-node
            data-depth={node.depth}
            className="absolute transition-transform duration-200 ease-out will-change-transform"
            style={{ ...node.pos }}
          >
            {/* Holographic Architecture Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-[#071122]/40 backdrop-blur-[2px] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              {/* Cyan Live Status Pulse Dot */}
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </span>

              {/* Icon */}
              <IconComponent className="w-3 h-3 text-cyan-400/70 shrink-0" />

              {/* Content */}
              <div className="flex flex-col">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-slate-300">
                  {node.label}
                </span>
                <span className="font-mono text-[8px] text-slate-500 uppercase tracking-wider">
                  {node.sublabel}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
