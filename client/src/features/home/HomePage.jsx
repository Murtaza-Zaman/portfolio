/**
 * HomePage — Premium personal technology brand experience.
 *
 * Sections:
 * 1. Hero         — dark navy, node graph visualization, hero stagger
 * 2. Trust Bar    — metrics strip
 * 3. Philosophy   — 4-step engineering process (light)
 * 4. Capabilities — numbered premium rows (light)
 * 5. Projects     — dark, 3D tilt cards
 * 6. CTA          — dark gradient, Initialize Collaboration
 */
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";

import { ContentState } from "../../components/common/ContentState";
import { Reveal } from "../../components/common/Reveal";
import { Seo } from "../../components/common/Seo";
import { TiltCard } from "../../components/ui/TiltCard";
import { TornRibbonText } from "../../components/ui/TornRibbonText";
import { CapabilityChip } from "../../components/ui/CapabilityChip";
import { NodeGraph } from "../../components/ui/NodeGraph";
import { SocialGlowButton } from "../../components/ui/SocialGlowButton";
import { brand } from "../../constants/brand";
import { HeroSkillRotation } from "../../design-system";
import { useNodeGraph, useProfile, useProjects } from "../../hooks/usePublicContent";
import { buildPersonSchema } from "../../utils/seoSchemas";
import { gsap } from "../../lib/gsap";
import { EngineeringIntelligenceSystem } from "./intelligence";
import { TextReveal } from "../../components/animations/TextReveal";
import { resolveProjectThumbnail } from "../../utils/projectImages";

const DEFAULT_SOCIAL_LINKS = [
  { platform: "GitHub", label: "GitHub", url: "https://github.com/murtazazaman", color: "cyan" },
  { platform: "LinkedIn", label: "LinkedIn", url: "https://linkedin.com/in/murtazazaman", color: "sky" },
  { platform: "Twitter", label: "Twitter / X", url: "https://twitter.com/murtazazaman", color: "purple" },
  { platform: "WhatsApp", label: "WhatsApp", url: "https://wa.me/923369406373", color: "emerald" },
];

/* ── Capabilities data ───────────────────────────────────────────────── */
const CAPABILITIES = [
  {
    n: "01",
    eyebrow: "Full-Stack Engineering",
    title: "Web & SaaS Applications",
    desc: "Scalable React frontends, Node.js APIs, and cloud-ready architectures built for performance and maintainability.",
    tags: ["React 19", "Next.js", "Node.js", "Express", "REST APIs"],
  },
  {
    n: "02",
    eyebrow: "AI Systems",
    title: "Intelligent Product Integrations",
    desc: "LLM integrations, RAG pipelines, and AI agent workflows embedded inside production-grade software products.",
    tags: ["LLM", "RAG Systems", "AI Agents", "Automation", "OpenAI API"],
  },
  {
    n: "03",
    eyebrow: "Cloud & Backend",
    title: "Scalable Infrastructure & APIs",
    desc: "High-throughput services, microservice workflows, and containerized cloud platforms engineered for reliability.",
    tags: ["MongoDB Atlas", "Docker", "Redis", "JWT / RBAC", "PostgreSQL"],
  },
  {
    n: "04",
    eyebrow: "Search Intelligence",
    title: "Technical SEO & GEO Strategy",
    desc: "Schema.org structured data, dynamic sitemaps, and machine-readable manifests for next-generation search visibility.",
    tags: ["JSON-LD", "GEO/AEO", "Core Web Vitals", "Semantic HTML"],
  },
];

/* ── Engineering process steps ──────────────────────────────────────── */
const PROCESS = [
  {
    n: "01",
    label: "Problem",
    desc: "Understand the business challenge, constraints, and what success actually looks like.",
  },
  {
    n: "02",
    label: "Architecture",
    desc: "Design the right system — not the most complex one. Trade-offs documented, options weighed.",
  },
  {
    n: "03",
    label: "Implementation",
    desc: "Build with engineering discipline. Clean code, tested, observable, deployable from day one.",
  },
  {
    n: "04",
    label: "Impact",
    desc: "Connect every technical decision back to a measurable business or user outcome.",
  },
];

/* ── Main component ──────────────────────────────────────────────────── */
export function HomePage() {
  const profile = useProfile();
  const projects = useProjects({ limit: 3 });
  const nodeGraph = useNodeGraph();

  const profileData = profile.data?.data || null;
  const cmsNodes = Array.isArray(nodeGraph.data?.data) ? nodeGraph.data.data : null;

  // Resolve dynamic Hero fields with robust defaults
  const badgeText = profileData?.badgeText || "Available for Projects";
  const badgeActive = profileData?.badgeActive ?? true;
  const scriptTag = profileData?.scriptTag || "Full-Stack Engineer";
  const nameLine1 = profileData?.nameLine1 || "MURTAZA";
  const nameLine2 = profileData?.nameLine2 || "ZAMAN";
  const rolePrefix = profileData?.rolePrefix || "Future Technology Builder";
  const roleSkills = profileData?.roleSkills?.length
    ? profileData.roleSkills
    : [
        "Technical SEO Strategy",
        "AI Systems Integration",
        "Full-Stack Architecture",
        "Cloud Infrastructure",
      ];
  const summaryText = profileData?.summary || brand.positioning;
  const heroChips = profileData?.heroSkills?.length
    ? profileData.heroSkills
    : ["React / Next.js", "Node.js", "AI Integrations", "Cloud Arch", "Technical SEO"];
  const primaryCtaText = profileData?.primaryCtaText || "Explore My Work";
  const primaryCtaLink = profileData?.primaryCtaLink || "/projects";
  const secondaryCtaText = profileData?.secondaryCtaText || "Start a Conversation";
  const secondaryCtaLink = profileData?.secondaryCtaLink || "/contact";
  const socialLinks = profileData?.socialLinks?.length ? profileData.socialLinks : DEFAULT_SOCIAL_LINKS;

  const philosophyEyebrow = profileData?.philosophyEyebrow || "Professional Approach";
  const philosophyHeading = profileData?.philosophyHeading || "Technology should move a real problem forward.";
  const philosophyDescription =
    profileData?.philosophyDescription ||
    "Understand the challenge, shape the right architecture, build with engineering discipline, and connect it to a measurable outcome.";
  const philosophyLinkLabel = profileData?.philosophyLinkLabel || "Engineering background";
  const philosophyLinkUrl = profileData?.philosophyLinkUrl || "/about";
  const philosophySteps = profileData?.philosophySteps?.length
    ? profileData.philosophySteps
    : PROCESS;

  // Hero refs
  const heroBadgeRef = useRef(null);
  const heroH1Ref = useRef(null);
  const heroSubRef = useRef(null);
  const heroBodyRef = useRef(null);
  const heroSocialRef = useRef(null);
  const heroCTAsRef = useRef(null);
  const heroChipsRef = useRef(null);

  // Capability rows ref
  const capRowsRef = useRef(null);

  const personSchema = buildPersonSchema({
    description: summaryText,
  });

  // Hero entrance stagger
  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = [
      heroBadgeRef.current,
      heroH1Ref.current,
      heroSubRef.current,
      heroBodyRef.current,
      heroChipsRef.current,
      heroSocialRef.current,
      heroCTAsRef.current,
    ];

    if (reduced) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(heroBadgeRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, 0.0)
      .fromTo(heroH1Ref.current,    { opacity: 0, y: 28, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "power4.out" }, 0.3)
      .fromTo(heroSubRef.current,   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 1.2)
      .fromTo(heroBodyRef.current,  { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 1.35)
      .fromTo(heroChipsRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 1.5)
      .fromTo(heroSocialRef.current,{ opacity: 0, y: 12, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 }, 1.6)
      .fromTo(heroCTAsRef.current,  { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 1.7);
  }, []);

  // Capability rows stagger
  useGSAP(() => {
    const rows = capRowsRef.current;
    if (!rows) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(rows.querySelectorAll("[data-cap-row]"), { opacity: 1, x: 0 });
      return;
    }
    gsap.fromTo(
      rows.querySelectorAll("[data-cap-row]"),
      { opacity: 0, x: -24 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: rows, start: "top 82%" },
      }
    );
  }, []);

  return (
    <>
      <Seo
        description={`${brand.name} — ${brand.positioning}`}
        structuredData={personSchema}
        title={brand.title}
      />

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden bg-transparent flex flex-col" data-cursor="hero">
        {/* Ambient mesh */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(6,182,212,0.18) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(244,63,94,0.1) 0%, transparent 55%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-16 px-6 pb-20 pt-36 lg:flex-row lg:items-center lg:gap-12 lg:px-8">
          {/* Left — Identity Column */}
          <div className="flex-1 space-y-8 lg:max-w-[52%]">
            {/* Availability badge */}
            <div ref={heroBadgeRef} style={{ opacity: 0 }}>
              <span className="status-available">
                {badgeActive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
                  </span>
                )}
                {badgeText}
              </span>
            </div>

            {/* Name — Torn ribbon editorial display (Tailwind CSS) */}
            <div ref={heroH1Ref} style={{ opacity: 0 }}>
              <TornRibbonText
                line1={nameLine1}
                line2={nameLine2}
                scriptTag={scriptTag}
                scriptTagColor="text-teal-300"
                ribbonTextColor="text-cyan-400"
                ribbonBg="bg-[#050c1a]"
                glowColor="rgba(34, 211, 238, 0.45)"
                fontSize="text-[clamp(60px,11vw,136px)]"
                ariaLabel={`${nameLine1} ${nameLine2}`}
              />
            </div>

            {/* Role / specialization */}
            <div
              ref={heroSubRef}
              style={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-8 bg-cyan-500/50 shrink-0" />
              <p className="font-mono text-sm font-medium text-slate-400 tracking-wide">
                <span className="text-cyan-400">{rolePrefix}</span>
                {" · "}
                <HeroSkillRotation
                  className="text-slate-300"
                  interval={3200}
                  skills={roleSkills}
                />
              </p>
            </div>

            {/* Positioning */}
            <p
              ref={heroBodyRef}
              style={{ opacity: 0 }}
              className="text-lg leading-relaxed text-slate-400 max-w-xl"
            >
              {summaryText}
            </p>

            {/* Tech stack chips */}
            <div
              ref={heroChipsRef}
              style={{ opacity: 0 }}
              className="flex flex-wrap gap-2"
            >
              {heroChips.map((chip) => (
                <CapabilityChip key={chip} label={chip} variant="dark" />
              ))}
            </div>

            {/* Glowing Social Media Badges (Directly above CTAs) */}
            <div
              ref={heroSocialRef}
              style={{ opacity: 0 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              {socialLinks.map((link, idx) => (
                <SocialGlowButton
                  key={idx}
                  platform={link.platform}
                  label={link.label || link.platform}
                  url={link.url}
                  color={link.color || "cyan"}
                  size="md"
                />
              ))}
            </div>

            {/* CTAs */}
            <div
              ref={heroCTAsRef}
              style={{ opacity: 0 }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <Link
                data-magnetic
                className="btn-primary"
                to={primaryCtaLink}
              >
                {primaryCtaText}
                <span aria-hidden="true" className="ml-1">→</span>
              </Link>
              <Link
                data-magnetic
                className="btn-ghost"
                to={secondaryCtaLink}
              >
                {secondaryCtaText}
              </Link>
            </div>
          </div>

          {/* Right — Node Graph Visualization */}
          <div className="relative w-full lg:max-w-[46%] lg:self-stretch">
            <div
              className="relative h-[420px] lg:h-full lg:min-h-[500px]"
              style={{ minHeight: "380px" }}
            >
              <NodeGraph nodes={cmsNodes?.length ? cmsNodes : undefined} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-10" aria-hidden="true">
          <div className="flex flex-col items-center gap-2 opacity-40">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">Scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-slate-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── 2. ENGINEERING INTELLIGENCE SYSTEM ─────────────────── */}
      <EngineeringIntelligenceSystem />

      {/* ── 3. PHILOSOPHY ───────────────────────────────────────── */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-6 py-24 lg:px-8 bg-transparent">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
            {/* Left: Statement */}
            <div className="space-y-6">
              <p className="eyebrow">
                <TextReveal as="span" variant="label">
                  {philosophyEyebrow}
                </TextReveal>
              </p>
              <h2 className="font-display text-4xl font-semibold leading-tight tracking-tighter text-white sm:text-5xl">
                <TextReveal as="span" variant="heading">
                  {philosophyHeading}
                </TextReveal>
              </h2>
              <p className="text-lg leading-relaxed text-slate-400">
                <TextReveal as="span" variant="body" delay={0.15}>
                  {philosophyDescription}
                </TextReveal>
              </p>
              <Link
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                to={philosophyLinkUrl}
              >
                {philosophyLinkLabel} <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Right: 4-step process */}
            <div className="space-y-2">
              {philosophySteps.map((step, i) => (
                <Reveal key={step.n || i} delay={i * 0.1}>
                  <div className="flex gap-5 rounded-2xl p-5 transition-colors duration-200 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] group">
                    <div className="flex-shrink-0 pt-0.5">
                      <span className="font-mono text-[11px] font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        {step.n}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        <TextReveal as="span" variant="label">
                          {step.label}
                        </TextReveal>
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── 4. CAPABILITIES ─────────────────────────────────────── */}
      <section className="bg-transparent border-y border-white/[0.07]">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-12 border-b border-white/[0.08]">
              <div>
                <p className="eyebrow">
                  <TextReveal as="span" variant="label">
                    Core Domains
                  </TextReveal>
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-tighter text-white">
                  <TextReveal as="span" variant="heading">
                    What I Build
                  </TextReveal>
                </h2>
              </div>
              <Link className="text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors" to="/services">
                All services →
              </Link>
            </div>
          </Reveal>

          <div ref={capRowsRef} className="divide-y divide-white/[0.06] mt-0">
            {CAPABILITIES.map(({ n, eyebrow, title, desc, tags }) => (
              <Link
                key={n}
                data-cap-row
                data-cursor="service"
                className="group flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-8 transition-all duration-300 hover:bg-white/[0.03] px-4 -mx-4 rounded-xl"
                to="/services"
              >
                <div className="flex items-start gap-6">
                  <span className="font-mono text-xs font-bold text-cyan-400 shrink-0 mt-1">
                    {n}
                  </span>
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                      <TextReveal as="span" variant="label">
                        {eyebrow}
                      </TextReveal>
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-white group-hover:text-cyan-300 transition-colors duration-200">
                      <TextReveal as="span" variant="heading">
                        {title}
                      </TextReveal>
                    </h3>
                    <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                      <TextReveal as="span" variant="body">
                        {desc}
                      </TextReveal>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end pl-12 lg:pl-0">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 font-mono text-[11px] text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="hidden sm:block text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300 shrink-0 text-lg">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FEATURED PROJECTS — Transparent ─────────────────── */}
      <Reveal>
        <section className="bg-transparent py-24 relative overflow-hidden">
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute top-0 right-0 w-[500px] h-[400px]"
            style={{
              background: "radial-gradient(ellipse at top right, rgba(6,182,212,0.1) 0%, transparent 60%)",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl space-y-12 px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <p className="eyebrow">
                  <TextReveal as="span" variant="label">
                    Selected Evidence
                  </TextReveal>
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-tighter text-white">
                  <TextReveal as="span" variant="heading">
                    Featured Projects
                  </TextReveal>
                </h2>
              </div>
              <Link className="text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors" to="/projects">
                View all projects →
              </Link>
            </div>

            {projects.isLoading || projects.error ? (
              <ContentState error={projects.error} isLoading={projects.isLoading} />
            ) : (
              <div className="grid gap-5 md:grid-cols-3">
                {(projects.data?.data ?? []).map((project) => {
                  const projectTags = project.tags?.length
                    ? project.tags
                    : project.technologies?.length
                    ? project.technologies
                    : [];
                  const projectLink = project.liveUrl || project.repositoryUrl || "/projects";
                  const isExternal = projectLink.startsWith("http");

                  const projectThumb = resolveProjectThumbnail(project);

                  const CardContent = (
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

                      {/* Category */}
                      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-400">
                        <TextReveal as="span" variant="label">
                          {project.category || "Project"}
                        </TextReveal>
                      </p>
                      <h3 className="font-display text-lg font-semibold text-white leading-tight">
                        <TextReveal as="span" variant="project">
                          {project.title}
                        </TextReveal>
                      </h3>
                      {projectTags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {projectTags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 font-mono text-[10px] text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : project.summary ? (
                        <p className="text-sm text-slate-400 leading-6 line-clamp-2">{project.summary}</p>
                      ) : null}
                      <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <span>View project</span>
                        <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  );

                  const cardBase =
                    "group block h-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.05] hover:shadow-glow-cyan";

                  return (
                    <TiltCard key={project.id || project._id || project.slug}>
                      {isExternal ? (
                        <a className={cardBase} data-cursor="project" href={projectLink} rel="noopener noreferrer" target="_blank">
                          {CardContent}
                        </a>
                      ) : (
                        <Link className={cardBase} data-cursor="project" to={projectLink}>
                          {CardContent}
                        </Link>
                      )}
                    </TiltCard>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {/* ── 6. CTA — Initialize Collaboration ───────────────────── */}
      <Reveal>
        <section className="relative overflow-hidden bg-transparent">
          {/* Mesh background */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(6,182,212,0.15) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 80% 20%, rgba(244,63,94,0.08) 0%, transparent 55%)",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-6 py-28 lg:px-8">
            <div className="max-w-2xl">
              <p className="eyebrow">
                <TextReveal as="span" variant="label">
                  Professional Engagement
                </TextReveal>
              </p>
              <h2 className="mt-4 font-display text-5xl font-semibold leading-tight tracking-tighter text-white sm:text-6xl">
                <TextReveal as="span" variant="hero">
                  Initialize Collaboration
                </TextReveal>
              </h2>
              <TextReveal as="p" variant="body" className="mt-6 text-lg leading-relaxed text-slate-400 max-w-xl">
                Share your technology challenge. I&apos;ll review the requirements, assess the architecture options, and outline a practical path forward.
              </TextReveal>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  data-magnetic
                  data-cursor="button"
                  className="btn-primary"
                  to="/contact"
                >
                  Start the conversation <span aria-hidden="true">&rarr;</span>
                </Link>
                <a
                  data-magnetic
                  data-cursor="button"
                  className="btn-ghost"
                  href={brand.contactInfo?.whatsappUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp {brand.contactInfo?.whatsappNumber || "+92 336 9406373"}
                </a>
              </div>

              {/* Terminal decoration */}
              <div className="mt-14 rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 font-mono text-xs text-slate-500 max-w-md">
                <p className="text-cyan-500/60 mb-2 text-[10px] uppercase tracking-widest">system.init</p>
                <p><span className="text-cyan-400">›</span> <span className="text-slate-400">define</span> your challenge</p>
                <p><span className="text-cyan-400">›</span> <span className="text-slate-400">select</span> project scope</p>
                <p><span className="text-cyan-400">›</span> <span className="text-slate-400">launch</span> collaboration
                  <span className="terminal-cursor ml-1" />
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
