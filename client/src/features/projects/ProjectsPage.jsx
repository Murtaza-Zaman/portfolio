/**
 * ProjectsPage — Editorial Numbered Showcase
 *
 * Rebuilt to match the layout, animation, and interaction of saifullah.dev/projects
 * using Murtaza Zaman's deep navy/cyan brand palette, typography, and project content.
 *
 * Features:
 * - Huge display page heading with breadcrumbs and category filter
 * - Fixed vertical scroll-progress rail with moving indicator (00 -> 100)
 * - Numbered project rows with title, outline tags, uppercase description, and preview card
 * - Staggered scroll-reveal animation via GSAP ScrollTrigger
 * - Hover state with thumbnail scale-up & title illumination
 * - Fixed bottom-right section badge + scroll-to-top action
 * - Fixed bottom-left contact micro-CTA
 * - Lenis inertia smooth-scrolling integration
 */

import { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";

import { Seo } from "../../components/common/Seo";
import { useProjects } from "../../hooks/usePublicContent";
import { buildBreadcrumbSchema } from "../../utils/seoSchemas";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { TextReveal } from "../../components/animations/TextReveal";

// Curated project assets for preview cards
import {
  resolveProjectThumbnail,
  seoPlatformImg,
  analyticsSaasImg,
  aiContentImg,
  ecommerceImg,
} from "../../utils/projectImages";

// Fallback curated projects with Murtaza Zaman's technical evidence
const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    index: "01",
    title: "SEO-Driven Developer Platform",
    slug: "seo-driven-developer-platform",
    category: "Developer Tool",
    serviceType: "Technical SEO & GEO",
    tags: ["Developer Tooling", "Search & Discovery"],
    summary:
      "High-performance technical documentation and case study platform with static prerendering, JSON-LD schemas, and 98+ Core Web Vitals.",
    image: seoPlatformImg,
    liveUrl: "/projects/seo-driven-developer-platform",
  },
  {
    id: "proj-2",
    index: "02",
    title: "Multi-Tenant Analytics SaaS",
    slug: "multi-tenant-analytics-saas",
    category: "Enterprise SaaS",
    serviceType: "Distributed Database & Analytics",
    tags: ["Enterprise SaaS", "Database Architecture"],
    summary:
      "Real-time event tracking and business metrics dashboard with custom query builders, compound MongoDB indexes, and RBAC security.",
    image: analyticsSaasImg,
    liveUrl: "/projects/multi-tenant-analytics-saas",
  },
  {
    id: "proj-3",
    index: "03",
    title: "Enterprise AI Content Platform",
    slug: "enterprise-ai-content-platform",
    category: "AI Integration",
    serviceType: "LLM Orchestration & Editorial Systems",
    tags: ["AI Integration", "Editorial Systems"],
    summary:
      "Custom content orchestration system integrating Gemini API with structured review workflows for editorial teams.",
    image: aiContentImg,
    liveUrl: "/projects/enterprise-ai-content-platform",
  },
  {
    id: "proj-4",
    index: "04",
    title: "E-Commerce Storefront",
    slug: "e-commerce-storefront",
    category: "E-Commerce Platform",
    serviceType: "Frontend Architecture & Commerce",
    tags: ["React", "Tailwind CSS", "Stripe", "Performance"],
    summary:
      "A responsive multi-category storefront with cart, checkout, and product filtering, built for sub-second performance on low-end mobile devices.",
    image: ecommerceImg,
    liveUrl: "/projects/e-commerce-storefront",
  },
];

// Helper to resolve the correct thumbnail for a project by slug / title
const resolveProjectImage = (item) => resolveProjectThumbnail(item);

const CATEGORY_FILTERS = [
  { label: "All", value: "" },
  { label: "SaaS", value: "SaaS" },
  { label: "AI", value: "AI" },
  { label: "Developer Tools", value: "Developer" },
  { label: "E-Commerce", value: "Commerce" },
];

export function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const query = useProjects({ category: selectedCategory });

  // Merge API projects with curated defaults and matched thumbnails
  const projectsList = useMemo(() => {
    const apiData = query.data?.data;
    if (Array.isArray(apiData) && apiData.length > 0) {
      return apiData.map((item, idx) => {
        const defaultMatch =
          DEFAULT_PROJECTS.find((p) => p.slug === item.slug) ||
          DEFAULT_PROJECTS[idx % DEFAULT_PROJECTS.length];
        return {
          id: item.id || item._id || `proj-${idx}`,
          index: String(idx + 1).padStart(2, "0"),
          title: item.title,
          slug: item.slug,
          category: item.category || defaultMatch.category,
          serviceType: item.serviceType || defaultMatch.serviceType,
          tags: item.tags?.length
            ? item.tags
            : item.technologies?.length
            ? item.technologies
            : defaultMatch.tags,
          summary: item.summary || defaultMatch.summary,
          image: resolveProjectImage(item),
          liveUrl: item.liveUrl || defaultMatch.liveUrl,
          repositoryUrl: item.repositoryUrl || defaultMatch.repositoryUrl,
        };
      });
    }
    return DEFAULT_PROJECTS;
  }, [query.data?.data]);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return projectsList;
    return projectsList.filter((p) => {
      return (
        p.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    });
  }, [projectsList, selectedCategory]);

  // Initialize Lenis smooth scroll and update left progress rail
  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateScrollProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const p = Math.min(1, Math.max(0, scrollY / totalScroll));
        setScrollProgress(p);
      }
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });

    let lenis = null;
    let rafId = null;

    if (!isReduced && typeof ResizeObserver !== "undefined") {
      try {
        lenis = new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.5,
        });

        lenis.on("scroll", (e) => {
          ScrollTrigger.update();
          if (e && typeof e.progress === "number") {
            setScrollProgress(e.progress);
          } else {
            updateScrollProgress();
          }
        });

        const raf = (time) => {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch {
        // Fallback gracefully to native scroll
      }
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateScrollProgress);
      if (lenis) lenis.destroy();
    };
  }, []);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
  ]);

  return (
    <>
      <Seo
        canonicalPath="/projects"
        description="Selected software engineering, cloud architectures, and digital product solutions engineered by Murtaza Zaman."
        structuredData={breadcrumbSchema}
        title="Projects — Murtaza Zaman"
      />

      {/* ── 1. Vertical Scroll-Progress Rail (Fixed on left edge) ──── */}
      <aside
        aria-hidden="true"
        className="fixed left-4 lg:left-7 top-1/2 -translate-y-1/2 h-[42vh] lg:h-[50vh] z-30 hidden md:flex flex-col items-center justify-between pointer-events-none select-none"
      >
        <span className="font-mono text-[10px] tracking-widest text-slate-500 font-medium">
          00
        </span>
        <div className="relative w-[1px] h-full bg-white/10 my-3">
          {/* Moving Indicator Capsule with Cyan Glow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[3px] h-[32px] bg-white rounded-full shadow-[0_0_12px_rgba(6,182,212,0.9)] transition-transform duration-75 ease-out"
            style={{
              top: `${(scrollProgress * 100).toFixed(2)}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
        <span className="font-mono text-[10px] tracking-widest text-slate-500 font-medium">
          100
        </span>
      </aside>

      {/* ── 2. Fixed Bottom-Left Micro-CTA ──────────────────────────── */}
      <div
        className={`fixed bottom-6 left-6 lg:left-8 z-40 hidden sm:block pointer-events-auto transition-opacity duration-300 ${
          scrollProgress > 0.88 ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="bg-[#050c1a]/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/[0.08] shadow-xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
            Wanna Say Hello?
          </p>
          <a
            href="mailto:contact@murtazazaman.com"
            className="font-mono text-xs font-semibold text-slate-200 hover:text-cyan-400 transition-colors tracking-wide block mt-0.5"
          >
            contact@murtazazaman.com
          </a>
        </div>
      </div>

      {/* ── 3. Main Page Container ──────────────────────────────────── */}
      <div className="relative min-h-screen bg-transparent text-slate-100 overflow-x-hidden pt-28 pb-32">

        {/* Ambient Top Glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[450px]"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-6 md:px-12 lg:px-16">
          {/* ── 4A. Page Header ──────────────────────────────────────── */}
          <header className="mb-14 sm:mb-20">
            {/* Breadcrumb line */}
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-cyan-400 font-semibold mb-4">
              <span>Home</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300">Projects</span>
            </div>

            {/* Massive Display Title */}
            <h1
              className="text-[clamp(68px,15vw,175px)] font-normal uppercase leading-[0.84] tracking-tight text-white select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
              style={{
                fontFamily: "'League Gothic', 'Arial Narrow', Impact, sans-serif",
                transform: "scaleY(1.04)",
                transformOrigin: "top left",
              }}
            >
              <TextReveal as="span" variant="hero" delay={0.08}>
                PROJECTS
              </TextReveal>
            </h1>

            {/* Subtitle & Filter Bar */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <TextReveal as="p" variant="label" className="font-mono text-xs uppercase tracking-[0.16em] text-slate-400 max-w-md">
                Selected Software Solutions, Cloud Architectures & Digital Products
              </TextReveal>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
                  {CATEGORY_FILTERS.map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedCategory(value)}
                      type="button"
                      className={`rounded-full px-3.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em] transition-all duration-200 ${
                        selectedCategory === value
                          ? "bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                          : "bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* ── 4B. Numbered Project List ─────────────────────────────── */}
          {filteredProjects.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
              <p className="font-mono text-sm text-slate-400 uppercase tracking-widest">
                No projects found in this category
              </p>
              <button
                onClick={() => setSelectedCategory("")}
                className="mt-4 px-4 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs uppercase tracking-wider hover:bg-cyan-500/30 transition-colors"
              >
                Show All Projects
              </button>
            </div>
          ) : (
            <ProjectListSection projects={filteredProjects} />
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Project List Section with GSAP Staggered Scroll-Reveal
 */
function ProjectListSection({ projects }) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const isReduced =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

      const rows = container.querySelectorAll("[data-project-row]");

      rows.forEach((row) => {
        const elements = row.querySelectorAll("[data-reveal]");
        if (isReduced || typeof ScrollTrigger === "undefined") {
          gsap.set(elements, { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          elements,
          {
            opacity: 0,
            y: 28,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { dependencies: [projects], scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col">
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}
    </div>
  );
}

/**
 * Individual Numbered Project Row Component
 */
function ProjectRow({ project }) {
  const projectLink = project.slug
    ? `/projects/${project.slug}`
    : project.liveUrl || project.repositoryUrl || "/contact";
  const isExternal = projectLink.startsWith("http");

  // Normalized tags (2 or more pills)
  const displayTags = useMemo(() => {
    if (Array.isArray(project.tags) && project.tags.length >= 2) {
      return project.tags.slice(0, 3);
    }
    return [
      project.category || "ENGINEERING",
      project.serviceType || "DEVELOPMENT",
    ];
  }, [project]);

  const InnerContent = (
    <article
      data-project-row
      className="group relative py-12 md:py-16 border-b border-dashed border-white/[0.12] transition-colors duration-300 hover:border-cyan-500/40"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ── Left Content: Index, Title, Tags, Description ─────────── */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top row: 2-Digit Index & External Indicator */}
          <div
            data-reveal
            className="flex items-center justify-between opacity-0"
          >
            <span
              className="font-mono text-lg md:text-2xl text-slate-500 font-bold tracking-widest group-hover:text-cyan-400 transition-colors duration-300"
              style={{
                fontFamily: "'League Gothic', 'Geist Mono', monospace",
              }}
            >
              {project.index}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 text-cyan-400 flex items-center gap-1 font-mono text-xs uppercase tracking-wider">
              <span>View Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          {/* Large Bold Project Title */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal uppercase tracking-wide text-white group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 leading-[0.95]"
            style={{
              fontFamily: "'League Gothic', 'Arial Narrow', Impact, sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            <TextReveal as="span" variant="project">
              {project.title}
            </TextReveal>
          </h2>

          {/* Outline / Pill-style Tag Buttons */}
          <div data-reveal className="flex flex-wrap gap-2 pt-1 opacity-0">
            {displayTags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-md border border-white/20 bg-transparent text-[10px] md:text-[11px] font-mono font-medium uppercase tracking-wider text-slate-300 group-hover:border-cyan-400/40 group-hover:text-cyan-200 transition-all duration-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 1–2 Line Description Paragraph */}
          <p
            data-reveal
            className="font-mono text-xs md:text-sm text-slate-400 uppercase tracking-wide leading-relaxed max-w-xl opacity-0"
          >
            {project.summary}
          </p>
        </div>

        {/* ── Right Content: Preview Thumbnail Card ─────────────────── */}
        <div
          data-reveal
          className="lg:col-span-5 flex justify-center lg:justify-end opacity-0"
        >
          <div className="w-full max-w-[440px] rounded-2xl border border-white/10 bg-[#081020]/90 p-2.5 sm:p-3 shadow-2xl group-hover:border-cyan-500/40 group-hover:shadow-[0_12px_40px_rgba(6,182,212,0.15)] transition-all duration-500">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-950">
              <img
                src={project.image}
                alt={`${project.title} preview`}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity duration-300"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );

  if (isExternal) {
    return (
      <a
        href={projectLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block no-underline cursor-pointer"
        data-cursor="project"
      >
        {InnerContent}
      </a>
    );
  }

  return (
    <Link
      to={projectLink}
      className="block no-underline cursor-pointer"
      data-cursor="project"
    >
      {InnerContent}
    </Link>
  );
}
