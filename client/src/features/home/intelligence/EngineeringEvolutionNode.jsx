import { useState } from "react";
import { Terminal, Database, Sparkles, Cloud } from "lucide-react";
import { TextReveal } from "../../../components/animations/TextReveal";

const DEFAULT_STAGES = [
  {
    id: "fe",
    label: "Frontend Engineering",
    desc: "Vercel aesthetics · 60fps micro-interactions · React 19",
    icon: Terminal,
    tag: "UI & INTERACTION",
  },
  {
    id: "be",
    label: "Backend Architecture",
    desc: "Node.js · Distributed APIs · High-throughput pipelines",
    icon: Database,
    tag: "SERVICES & DATA",
  },
  {
    id: "cloud",
    label: "Cloud Systems",
    desc: "Docker containerization · Redis caching · 99.9% Uptime",
    icon: Cloud,
    tag: "INFRASTRUCTURE",
  },
  {
    id: "ai",
    label: "Artificial Intelligence",
    desc: "LLM agents · RAG pipelines · Autonomous workflows",
    icon: Sparkles,
    tag: "INTELLIGENT SYSTEMS",
  },
];

const ICONS = [Terminal, Database, Cloud, Sparkles];

export function EngineeringEvolutionNode({ data }) {
  const [activeStage, setActiveStage] = useState(3);

  // Merge CMS data with defaults
  const nodeLabel = data?.nodeLabel || "NODE 02 // PROGRESSION";
  const nodeTag = data?.nodeTag || "EVOLUTION PIPELINE";
  const title = data?.title || "Engineering Evolution";
  const description = data?.description || "From pixel-perfect client interfaces to resilient cloud backends and autonomous AI agents.";

  const stages = data?.items?.length
    ? data.items.map((item, idx) => ({
        id: `item-${idx}`,
        label: item.label,
        desc: item.description,
        icon: ICONS[idx % ICONS.length],
        tag: item.tag,
      }))
    : DEFAULT_STAGES;

  return (
    <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.05] hover:shadow-glow-cyan">
      {/* Node Header */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
          <span className="font-mono text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
            <TextReveal as="span" variant="label">
              {nodeLabel}
            </TextReveal>
          </span>
          <span className="font-mono text-[9px] text-slate-500 uppercase">{nodeTag}</span>
        </div>

        <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-white">
          <TextReveal as="span" variant="heading">
            {title}
          </TextReveal>
        </h3>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
          {description}
        </p>

        {/* Stepped Evolution Pipeline */}
        <div className="relative mt-5 pl-4 space-y-4">
          {/* Vertical Connecting Bus Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500 via-teal-400 to-cyan-400 opacity-30" />

          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            const Icon = stage.icon;
            return (
              <div
                key={stage.id}
                onMouseEnter={() => setActiveStage(idx)}
                className="group/stage relative flex items-start gap-3 cursor-pointer"
              >
                {/* Milestone Node Marker */}
                <div
                  className={`relative -ml-[13px] mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                    isActive
                      ? "border-cyan-400 bg-cyan-500 shadow-[0_0_8px_#06b6d4]"
                      : "border-white/20 bg-[#050c1a] group-hover/stage:border-cyan-400/60"
                  }`}
                >
                  <span
                    className={`h-1 w-1 rounded-full ${
                      isActive ? "bg-slate-950" : "bg-white/40"
                    }`}
                  />
                </div>

                {/* Stage Info */}
                <div
                  className={`flex-1 rounded-lg p-2 transition-colors ${
                    isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white tracking-wide">
                      {stage.label}
                    </span>
                    <span className="font-mono text-[8px] font-medium tracking-wider text-cyan-400/80">
                      {stage.tag}
                    </span>
                  </div>
                  <p className="font-mono text-[9px] text-slate-400 mt-0.5 leading-normal">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
