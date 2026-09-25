import { useState } from "react";
import { Compass, Network, Code2, Trophy } from "lucide-react";
import { TextReveal } from "../../../components/animations/TextReveal";

const DEFAULT_PHASES = [
  {
    step: "01",
    name: "Problem",
    title: "Root Cause & Constraints",
    desc: "Dissect core challenge, user friction, latency bottlenecks & scale goals.",
    icon: Compass,
    accent: "text-rose-400",
  },
  {
    step: "02",
    name: "Architecture",
    title: "System Topology & Contracts",
    desc: "Design data flow, API boundaries, state machines, and failover fallbacks.",
    icon: Network,
    accent: "text-cyan-400",
  },
  {
    step: "03",
    name: "Implementation",
    title: "Disciplined Engineering",
    desc: "Clean modular code, automated tests, atomic transactions & zero regressions.",
    icon: Code2,
    accent: "text-teal-400",
  },
  {
    step: "04",
    name: "Impact",
    title: "Measurable Outcome",
    desc: "Sub-second speed, zero downtime, high user retention, and business growth.",
    icon: Trophy,
    accent: "text-amber-400",
  },
];

const ICONS = [Compass, Network, Code2, Trophy];
const ACCENTS = ["text-rose-400", "text-cyan-400", "text-teal-400", "text-amber-400"];

export function ArchitectureMindsetNode({ data }) {
  const [activeStep, setActiveStep] = useState(0);

  // Merge CMS data with defaults
  const nodeLabel = data?.nodeLabel || "NODE 04 // METHODOLOGY";
  const nodeTag = data?.nodeTag || "PROBLEM-SOLVING FRAMEWORK";
  const title = data?.title || "Architecture Mindset";
  const description =
    data?.description ||
    "How I think and execute: from initial ambiguity to resilient, high-impact software systems.";

  const phases = data?.items?.length
    ? data.items.map((item, idx) => ({
        step: String(idx + 1).padStart(2, "0"),
        name: item.label,
        title: item.tag || "",
        desc: item.description,
        icon: ICONS[idx % ICONS.length],
        accent: ACCENTS[idx % ACCENTS.length],
      }))
    : DEFAULT_PHASES;

  return (
    <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.05] hover:shadow-glow-cyan">
      {/* Node Header */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
          <TextReveal
            as="span"
            variant="label"
            className="font-mono text-[10px] font-bold tracking-widest text-cyan-400 uppercase"
          >
            {nodeLabel}
          </TextReveal>
          <span className="font-mono text-[9px] text-slate-500 uppercase">
            {nodeTag}
          </span>
        </div>

        <TextReveal
          as="h3"
          variant="heading"
          className="mt-4 font-display text-xl font-bold tracking-tight text-white"
        >
          {title}
        </TextReveal>
        <TextReveal
          as="p"
          variant="body"
          className="mt-1 text-xs text-slate-400 leading-relaxed"
        >
          {description}
        </TextReveal>

        {/* Stepped Problem Solving Pipeline */}
        <div className="mt-5 space-y-2.5">
          {phases.map((phase, idx) => {
            const Icon = phase.icon;
            const isActive = activeStep === idx;
            return (
              <div
                key={phase.step}
                onMouseEnter={() => setActiveStep(idx)}
                className={`group/step relative flex items-start gap-3 rounded-xl border p-2.5 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-cyan-500/40 bg-cyan-500/[0.08] shadow-[0_0_12px_rgba(6,182,212,0.12)]"
                    : "border-white/[0.05] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[10px] font-bold text-cyan-400">
                    {phase.step}
                  </span>
                  <div className={`p-1 rounded-md bg-white/[0.04] ${phase.accent}`}>
                    <Icon size={13} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white tracking-wide leading-tight">
                    {phase.name}
                    {phase.title ? ` · ${phase.title}` : ""}
                  </div>
                  <p className="font-mono text-[9px] text-slate-400 mt-0.5 leading-normal">
                    {phase.desc}
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
