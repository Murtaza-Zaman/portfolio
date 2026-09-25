import { useState } from "react";
import { TextReveal } from "../../../components/animations/TextReveal";

const DEFAULT_DOMAINS = [
  {
    name: "AI",
    category: "Intelligent Systems",
    role: "LLM Orchestration & RAG Pipelines",
    details: "Autonomous AI agents, vector retrieval, embeddings, and context window optimization.",
  },
  {
    name: "LLM",
    category: "Language Models",
    role: "Model Integrations & Function Calling",
    details: "Tool usage, structured JSON output validation, and low-latency streaming responses.",
  },
  {
    name: "React",
    category: "Client Tier",
    role: "Modern Frontend Engineering",
    details: "React 19, custom hook architectures, optimistic UI updates, and 60fps animations.",
  },
  {
    name: "Next.js",
    category: "Full-Stack Web",
    role: "Server Components & Edge Runtimes",
    details: "Sub-second LCP, zero-bundle-size server logic, dynamic routing, and CDN caching.",
  },
  {
    name: "Node.js",
    category: "Backend Services",
    role: "High-Throughput Distributed APIs",
    details: "Event-driven asynchronous processing, resilient error boundaries, and streaming I/O.",
  },
  {
    name: "Cloud",
    category: "Infrastructure",
    role: "Cloud Native & Containerization",
    details: "Docker container workflows, Redis caching layers, microservices, and 99.9% SLAs.",
  },
  {
    name: "Databases",
    category: "Data Layer",
    role: "Schema Architecture & Persistence",
    details: "MongoDB Atlas indexing, aggregation pipelines, transaction atomicity, and query tuning.",
  },
  {
    name: "SEO",
    category: "Search Intelligence",
    role: "GEO/AEO & Structured Schemas",
    details: "Schema.org JSON-LD, crawl optimization, dynamic sitemaps, and Core Web Vitals.",
  },
];

export function TechnologyConstellationNode({ data }) {
  // Merge CMS data with defaults
  const nodeLabel = data?.nodeLabel || "NODE 03 // CONSTELLATION";
  const nodeTag = data?.nodeTag || "INTERACTIVE CLUSTER";
  const title = data?.title || "Technology Domains";
  const description = data?.description || "Hover a domain to inspect its architectural purpose and technical execution.";

  const domains = data?.items?.length
    ? data.items.map((item) => ({
        name: item.label,
        category: item.tag,
        role: item.label,
        details: item.description,
      }))
    : DEFAULT_DOMAINS;

  const [selectedDomain, setSelectedDomain] = useState(domains[0]);

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

        {/* Interactive Constellation Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {domains.map((domain) => {
            const isSelected = selectedDomain.name === domain.name;
            return (
              <button
                key={domain.name}
                type="button"
                onMouseEnter={() => setSelectedDomain(domain)}
                onClick={() => setSelectedDomain(domain)}
                className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan scale-105"
                    : "bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:border-cyan-500/30 hover:bg-white/[0.08]"
                }`}
              >
                {domain.name}
              </button>
            );
          })}
        </div>

        {/* Active Domain Live Inspector Panel */}
        <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 space-y-1.5 min-h-[96px]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-semibold text-cyan-400 uppercase tracking-widest">
              {selectedDomain.category}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div className="text-xs font-semibold text-white">
            {selectedDomain.role}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {selectedDomain.details}
          </p>
        </div>
      </div>
    </div>
  );
}
