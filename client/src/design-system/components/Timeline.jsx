import { useRef } from "react";
import { clsx } from "clsx";
import { useGSAP } from "@gsap/react";

import { TechPill } from "./TechPill";
import { gsap } from "../../lib/gsap";

/**
 * Timeline - Interactive chronological career & capability milestones in dark theme.
 */
export function Timeline({ className = "", items = [] }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container || !items.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(container.querySelectorAll("[data-timeline-item]"), { opacity: 1, x: 0 });
      return;
    }

    // Animate the vertical line from 0 height to full height
    const line = container.querySelector("[data-timeline-line]");
    if (line) {
      gsap.fromTo(
        line,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
          },
        }
      );
    }

    // Stagger items sliding in from left
    gsap.fromTo(
      container.querySelectorAll("[data-timeline-item]"),
      { opacity: 0, x: -32 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={clsx("relative space-y-8 pl-6", className)}
    >
      {/* The line — animated in by GSAP */}
      <div
        data-timeline-line
        className="absolute left-0 top-0 h-full border-l-2 border-cyan-500/30"
        style={{ transformOrigin: "top" }}
      />

      {items.map((item, index) => (
        <div
          data-timeline-item
          className="relative group"
          key={item.id || index}
          style={{ opacity: 0 }}
        >
          {/* Timeline Node Dot */}
          <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-cyan-400 bg-[#050c1a] group-hover:bg-cyan-400 transition-colors" />

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 shadow-sm hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
                {item.period || item.year}
              </span>
              {item.category && (
                <span className="text-xs text-slate-400 font-mono">
                  {item.category}
                </span>
              )}
            </div>

            <h4 className="mt-2 font-display text-xl font-semibold text-white">
              {item.title}
            </h4>

            {item.organization && (
              <p className="mt-1 text-sm font-medium text-slate-400">
                {item.organization}
              </p>
            )}

            {item.description && (
              <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                {item.description}
              </p>
            )}

            {item.technologies && item.technologies.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.technologies.map((tech) => (
                  <TechPill dark key={tech} label={tech} size="xs" />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
