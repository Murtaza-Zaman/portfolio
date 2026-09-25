/**
 * ServicesPage — Premium services listing with dark hero intro.
 * Data-driven cards connect to backend API.
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Layers, Cloud, Brain, Search } from "lucide-react";

import { ContentState } from "../../components/common/ContentState";
import { PageIntro } from "../../components/common/PageIntro";
import { Seo } from "../../components/common/Seo";
import { TiltCard } from "../../components/ui/TiltCard";
import { useServices } from "../../hooks/usePublicContent";
import { buildBreadcrumbSchema } from "../../utils/seoSchemas";
import { gsap } from "../../lib/gsap";
import { TextReveal } from "../../components/animations/TextReveal";

// Default services if API returns nothing
const DEFAULT_SERVICES = [
  {
    id: "full-stack",
    slug: "full-stack",
    name: "Full-Stack Web & SaaS Engineering",
    category: "Core Engineering",
    summary:
      "End-to-end software development: React frontends, Node.js APIs, MongoDB databases, and cloud-ready SaaS architectures engineered for scale and maintainability.",
    icon: Layers,
    color: "#06b6d4",
    technologies: ["React 19", "Next.js", "Node.js", "Express", "MongoDB Atlas", "REST APIs"],
  },
  {
    id: "cloud-arch",
    slug: "cloud-architecture",
    name: "Cloud & Backend Architecture",
    category: "Systems Engineering",
    summary:
      "High-throughput distributed systems, microservice workflows, Redis caching pipelines, and production-grade infrastructure engineered for reliability and uptime.",
    icon: Cloud,
    color: "#8b5cf6",
    technologies: ["Docker", "Redis", "PostgreSQL", "JWT / RBAC", "Microservices"],
  },
  {
    id: "ai-integrations",
    slug: "ai-integrations",
    name: "AI & Intelligent System Integrations",
    category: "AI Engineering",
    summary:
      "LLM integrations, RAG pipeline architectures, and AI agent workflows embedded inside production software — making your product intelligently responsive.",
    icon: Brain,
    color: "#f43f5e",
    technologies: ["OpenAI API", "RAG Systems", "LLM Orchestration", "AI Agents", "Embeddings"],
  },
  {
    id: "seo-geo",
    slug: "technical-seo",
    name: "Technical SEO & GEO Strategy",
    category: "Search Intelligence",
    summary:
      "Schema.org JSON-LD structured data, dynamic sitemaps, GEO/AEO optimization, and sub-second Core Web Vitals engineering for next-generation search discovery.",
    icon: Search,
    color: "#10b981",
    technologies: ["JSON-LD", "GEO/AEO", "Core Web Vitals", "Semantic HTML", "Canonical Tags"],
  },
];

export function ServicesPage() {
  const query = useServices();

  const servicesBreadcrumbs = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
  ]);

  const services = query.data?.data?.length ? query.data.data : DEFAULT_SERVICES;

  return (
    <>
      <Seo
        canonicalPath="/services"
        description="Engineering services spanning full-stack development, cloud architecture, AI integrations, and technical SEO — built for serious digital products."
        structuredData={servicesBreadcrumbs}
        title="Engineering Services"
      />

      {/* Hero intro */}
      <section className="bg-transparent relative overflow-hidden" data-cursor="hero">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(6,182,212,0.15) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-28 lg:px-8">
          <PageIntro
            dark
            description="Technology services organized around the problems they solve, the systems they create, and the value they deliver."
            eyebrow="Solutions"
            title="Build something that works."
          />
        </div>
      </section>

      {/* Services grid */}
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 space-y-12">
        {query.isLoading ? (
          <ContentState isLoading />
        ) : query.error ? (
          <ServicesGrid services={DEFAULT_SERVICES} />
        ) : (
          <ServicesGrid services={services} />
        )}
      </div>
    </>
  );
}

function ServicesGrid({ services }) {
  const gridRef = useRef(null);

  useGSAP(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(grid.querySelectorAll("[data-service-card]"), { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      grid.querySelectorAll("[data-service-card]"),
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [services]);

  return (
    <div ref={gridRef} className="grid gap-6 md:grid-cols-2">
      {services.map((service) => {
        const Icon = service.icon;
        const color = service.color || "#06b6d4";
        const techs = service.technologies || service.competencies || [];

        return (
          <div data-service-card key={service.id || service.slug} style={{ opacity: 0 }}>
            <TiltCard>
              <article className="group relative h-full rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 shadow-card transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.05] hover:shadow-glow-cyan overflow-hidden" data-cursor="service">
                {/* Top color accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
                />

                <div className="space-y-4">
                  {/* Icon + category */}
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10"
                      style={{ background: `${color}20` }}
                    >
                      {Icon ? (
                        <Icon size={20} style={{ color }} />
                      ) : (
                        <span
                          className="font-mono text-xs font-bold"
                          style={{ color }}
                        >
                          {(service.name || "")[0]}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                      <TextReveal as="span" variant="label">
                        {service.category}
                      </TextReveal>
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors duration-200 leading-snug">
                    <TextReveal as="span" variant="heading">
                      {service.name}
                    </TextReveal>
                  </h2>

                  {/* Description */}
                  <p className="text-sm leading-6 text-slate-300">
                    <TextReveal as="span" variant="body">
                      {service.summary}
                    </TextReveal>
                  </p>

                  {/* Technologies */}
                  {techs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {techs.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-full bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 font-mono text-[10px] text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex items-center gap-1.5 pt-1 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200">
                    <span>Explore service</span>
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </div>
                </div>
              </article>
            </TiltCard>
          </div>
        );
      })}
    </div>
  );
}
