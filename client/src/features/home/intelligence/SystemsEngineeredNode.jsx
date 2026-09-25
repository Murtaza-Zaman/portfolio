import { useState } from "react";
import { Layers, Cpu, Globe, Server } from "lucide-react";
import { TextReveal } from "../../../components/animations/TextReveal";

const DEFAULT_TIERS = [
  {
    id: "web",
    title: "Web Applications",
    spec: "Next.js · React 19 · Sub-Second LCP",
    icon: Globe,
    accent: "text-cyan-400",
  },
  {
    id: "saas",
    title: "SaaS Platforms",
    spec: "Multi-Tenant · RBAC · Stripe · MongoDB",
    icon: Layers,
    accent: "text-teal-400",
  },
  {
    id: "ai",
    title: "AI Systems",
    spec: "LLM Pipelines · RAG · Vector Retrieval",
    icon: Cpu,
    accent: "text-sky-400",
  },
  {
    id: "cloud",
    title: "Digital Products",
    spec: "End-to-End Delivery · CI/CD · Cloud Native",
    icon: Server,
    accent: "text-indigo-400",
  },
];

const ICONS = [Globe, Layers, Cpu, Server];
const ACCENTS = ["text-cyan-400", "text-teal-400", "text-sky-400", "text-indigo-400"];

export function SystemsEngineeredNode({ data }) {
  const [activeTier, setActiveTier] = useState(0);

  // Merge CMS data with defaults
  const nodeLabel = data?.nodeLabel || "NODE 01 // TOPOLOGY";
  const title = data?.title || "Systems Engineered";
  const description = data?.description || "Production digital systems architected for resilience, low latency, and continuous scale.";

  const tiers = data?.items?.length
    ? data.items.map((item, idx) => ({
        id: `item-${idx}`,
        title: item.label,
        spec: item.tag || item.description,
        icon: ICONS[idx % ICONS.length],
        accent: ACCENTS[idx % ACCENTS.length],
      }))
    : DEFAULT_TIERS;

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
          <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-white">
          <TextReveal as="span" variant="heading">
            {title}
          </TextReveal>
        </h3>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
          {description}
        </p>

        {/* Interactive Architecture Stack */}
        <div className="mt-5 space-y-2">
          {tiers.map((tier, idx) => {
            const Icon = tier.icon;
            const isActive = activeTier === idx;
            return (
              <div
                key={tier.id}
                onMouseEnter={() => setActiveTier(idx)}
                className={`group/tier relative flex items-center justify-between rounded-xl border px-3.5 py-2.5 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1 rounded-md bg-white/[0.04] ${tier.accent}`}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white tracking-wide">
                      {tier.title}
                    </div>
                    <div className="font-mono text-[9px] text-slate-400 mt-0.5">
                      {tier.spec}
                    </div>
                  </div>
                </div>

                {/* Status pulse */}
                <span
                  className={`h-1 w-1 rounded-full transition-opacity ${
                    isActive ? "bg-cyan-400 opacity-100" : "bg-slate-600 opacity-40"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
