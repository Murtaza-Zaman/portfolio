/**
 * AboutPage — Premium engineering profile.
 * Dark hero intro → Identity & values cards → Career timeline → Work showcase
 */
import { Link } from "react-router-dom";

import { ContentState } from "../../components/common/ContentState";
import { PageIntro } from "../../components/common/PageIntro";
import { Reveal } from "../../components/common/Reveal";
import { Seo } from "../../components/common/Seo";
import { GlassCard } from "../../components/ui/GlassCard";
import { TiltCard } from "../../components/ui/TiltCard";
import { brand } from "../../constants/brand";
import { TechPill, Timeline } from "../../design-system";
import { useProfile, useProjects } from "../../hooks/usePublicContent";
import { buildBreadcrumbSchema, buildPersonSchema } from "../../utils/seoSchemas";
import { TextReveal } from "../../components/animations/TextReveal";
import { resolveProjectThumbnail } from "../../utils/projectImages";

const defaultMilestones = [
  {
    id: "m1",
    period: "2024 — Present",
    category: "Cloud & Full-Stack Systems",
    title: "Future Technology Builder & Cloud Systems Architect",
    organization: "Independent Engineering & Solutions Consulting",
    description:
      "Designing and developing high-throughput cloud microservices, scalable distributed APIs, and production-grade full-stack React / Node.js platforms with AI integrations.",
    technologies: ["React 19", "Node.js", "Express", "MongoDB Atlas", "LLM APIs", "Redis"],
  },
  {
    id: "m2",
    period: "2022 — 2024",
    category: "SaaS Architecture",
    title: "Senior Full-Stack & Cloud Systems Engineer",
    organization: "SaaS Platforms & Distributed Engineering",
    description:
      "Architected multi-tenant web applications, secure JWT authentication with token rotation, RBAC permission models, and cloud database optimizations.",
    technologies: ["Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT / RBAC"],
  },
  {
    id: "m3",
    period: "2020 — 2022",
    category: "Frontend & Technical Search",
    title: "Web Application Developer & Technical SEO Strategist",
    organization: "Digital Products & High-Performance Web",
    description:
      "Engineered high-performance web interfaces with modern design systems, Schema.org JSON-LD structured data, and Core Web Vitals optimizations.",
    technologies: ["JavaScript ES6+", "React", "Schema.org", "Core Web Vitals", "SEO Architecture"],
  },
];

const SKILLS = [
  { category: "Frontend", items: ["React 19", "Next.js", "TypeScript", "Tailwind CSS", "GSAP"] },
  { category: "Backend", items: ["Node.js", "Express", "REST APIs", "JWT Auth", "MongoDB"] },
  { category: "AI / Integrations", items: ["OpenAI API", "LLM Orchestration", "RAG Systems", "AI Agents"] },
  { category: "Search & Infrastructure", items: ["Technical SEO", "JSON-LD", "GEO/AEO", "Docker", "Redis"] },
];

export function AboutPage() {
  const profile = useProfile();
  const projects = useProjects({ limit: 3 });
  const data = profile.data?.data;

  const aboutSchema = [
    buildPersonSchema({ description: data?.summary ?? brand.positioning }),
    buildBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "About", url: "/about" },
    ]),
  ];

  return (
    <>
      <Seo
        canonicalPath="/about"
        description="Professional profile, technology philosophy, and engineering background of Murtaza Zaman."
        structuredData={aboutSchema}
        title="About Murtaza Zaman"
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-transparent relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(6,182,212,0.15) 0%, transparent 55%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-28 lg:px-8">
          <PageIntro
            dark
            description={data?.summary ?? brand.positioning}
            eyebrow="Professional Profile"
            title={data?.title ?? brand.title}
          />
        </div>
      </section>

      {/* ── Identity & Approach ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl space-y-16 px-6 py-16 lg:px-8">
        {profile.isLoading || profile.error ? (
          <ContentState error={profile.error} isLoading={profile.isLoading} />
        ) : (
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Identity statement — dark card */}
              <article className="rounded-2xl bg-[#0a0f1e] p-8 text-slate-100 border border-white/[0.07]">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-500 mb-5">
                  // Identity Statement
                </p>
                <p className="text-sm leading-8 text-slate-300">
                  {data?.identityStatement ?? brand.summary}
                </p>
                <p className="mt-5 leading-8 text-slate-400 text-sm">
                  {data?.technologyPerspective ??
                    "Technology is most valuable when engineering decisions remain connected to user needs, business context, and measurable improvement."}
                </p>
                <div className="mt-8 border-t border-white/[0.07] pt-6">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-500/70 mb-3">
                    Core Capability Areas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(data?.capabilityAreas ?? brand.capabilities).map((area) => (
                      <TechPill dark key={area} label={area} />
                    ))}
                  </div>
                </div>
              </article>

              {/* Approach & values — dark card */}
              <aside className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 flex flex-col justify-between">
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-400 mb-4">
                    Approach & Values
                  </p>
                  <p className="leading-relaxed text-slate-300 text-sm">
                    {data?.approach ??
                      "Understand the challenge, design the right system, build with care, and connect the result to a real outcome."}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {(
                      data?.professionalValues ?? [
                        "Clear communication & transparency",
                        "Practical engineering problem solving",
                        "Maintainable, clean architecture",
                        "Measurable business outcomes",
                      ]
                    ).map((value) => (
                      <li className="flex items-center gap-2.5 text-sm text-slate-300" key={value}>
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  to="/contact"
                >
                  Start a conversation <span aria-hidden="true">→</span>
                </Link>
              </aside>
            </div>
          </Reveal>
        )}

        {/* ── Skills grid ──────────────────────────────────────── */}
        <Reveal>
          <section>
            <div className="mb-8">
              <p className="eyebrow">
                Technical Stack
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tighter text-white">
                Engineering Capabilities
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SKILLS.map(({ category, items }) => (
                <GlassCard key={category} padding="p-5">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-400 mb-3">
                    {category}
                  </p>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="text-sm text-slate-300 flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-cyan-400/60 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── Career Timeline ───────────────────────────────────── */}
        <Reveal>
          <section className="space-y-8">
            <div>
              <p className="eyebrow">
                Journey & Evolution
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tighter text-white">
                Career Milestones
              </h2>
            </div>
            <Timeline items={defaultMilestones} />
          </section>
        </Reveal>

        {/* ── Work showcase ─────────────────────────────────────── */}
        <Reveal>
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="eyebrow">
                  Evidence
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tighter text-white">
                  Work that makes it concrete
                </h2>
              </div>
              <Link className="text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors" to="/projects">
                View all →
              </Link>
            </div>
            {projects.isLoading || projects.error ? (
              <ContentState error={projects.error} isLoading={projects.isLoading} />
            ) : (
              <div className="grid gap-5 md:grid-cols-3">
                {(projects.data?.data ?? []).map((project) => {
                  const isExt = Boolean(
                    project.liveUrl &&
                      (project.liveUrl.startsWith("http://") || project.liveUrl.startsWith("https://"))
                  );
                  const projectTags = project.tags?.length
                    ? project.tags
                    : project.technologies?.length
                    ? project.technologies
                    : [];
                  const projectThumb = resolveProjectThumbnail(project);

                  const CardInner = (
                    <div className="space-y-3">
                      {/* Picture Section */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-[#081020]/90 mb-3.5 shadow-md group-hover:border-cyan-500/40 group-hover:shadow-[0_8px_30px_rgba(6,182,212,0.18)] transition-all duration-500">
                        <img
                          src={projectThumb}
                          alt={`${project.title} preview`}
                          loading="lazy"
                          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = resolveProjectThumbnail(null);
                          }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050c1a]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                      </div>

                      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-400">
                        <TextReveal as="span" variant="label">
                          {project.category || "Project"}
                        </TextReveal>
                      </p>
                      <h3 className="font-display text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        <TextReveal as="span" variant="project">
                          {project.title}
                        </TextReveal>
                      </h3>
                      {projectTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {projectTags.slice(0, 3).map((tag) => (
                            <TechPill dark key={tag} label={tag} size="xs" />
                          ))}
                        </div>
                      )}
                      <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <span>View project</span>
                        <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  );

                  return (
                    <TiltCard key={project.id || project._id || project.slug}>
                      {isExt ? (
                        <a
                          className="group block h-full rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 hover:border-cyan-500/30 hover:bg-white/[0.05] hover:shadow-glow-cyan transition-all duration-300"
                          href={project.liveUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {CardInner}
                        </a>
                      ) : (
                        <Link
                          className="group block h-full rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 hover:border-cyan-500/30 hover:bg-white/[0.05] hover:shadow-glow-cyan transition-all duration-300"
                          to={project.liveUrl || "/projects"}
                        >
                          {CardInner}
                        </Link>
                      )}
                    </TiltCard>
                  );
                })}
              </div>
            )}
          </section>
        </Reveal>
      </section>
    </>
  );
}
