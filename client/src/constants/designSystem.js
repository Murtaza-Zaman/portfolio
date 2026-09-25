/**
 * Section 03: Visual Design & Creative Direction Blueprint
 * Codifies design philosophy, color system, typography scale, layout composition,
 * component hierarchy, motion timing, responsive architecture, and accessibility standards.
 */

export const VISUAL_PHILOSOPHY = {
  category: "Premium Technology Personal Brand",
  positioning: "Between Luxury Consulting Brand, Advanced Technology Company, and Modern Software Studio",
  balance: {
    technology: 40,
    luxuryConsulting: 30,
    humanClarity: 20,
    creativeExpression: 10,
  },
  motto: "Less decoration, more meaning. Intelligence through simplicity, innovation through precision, professionalism through quality.",
};

export const COLOR_SYSTEM_SPEC = {
  foundation: {
    darkSurface: "#020617", // Slate 950
    darkCard: "#0f172a",    // Slate 900
    lightSurface: "#f8fafc",// Slate 50
    lightCard: "#ffffff",   // Pure White
  },
  brand: {
    primaryTeal: "#0f766e",
    primaryBlue: "#075985",
    darkTeal: "#115e59",
    deepNavy: "#082f49",
  },
  accents: {
    coralRose: "#be123c",
    vibrantOrange: "#ea580c",
  },
  functional: {
    success: "#0d9488",
    warning: "#d97706",
    error: "#e11d48",
    info: "#0284c7",
  },
  surfaces: [
    { level: 1, name: "Primary Background", usage: "Main page visual environment" },
    { level: 2, name: "Secondary Background", usage: "Section distinction and visual rhythm" },
    { level: 3, name: "Card Surface", usage: "Content grouping and elevation" },
    { level: 4, name: "Interactive Surface", usage: "Buttons, inputs, tabs, and controls" },
  ],
};

export const TYPOGRAPHY_SPEC = {
  fontFamilies: {
    display: "Outfit, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, Fira Code, monospace",
  },
  levels: [
    { tag: "Display", size: "text-5xl to text-7xl", role: "Cinematic hero introductions & core statements" },
    { tag: "H1", size: "text-4xl to text-5xl", role: "Primary page title & section lead message" },
    { tag: "H2", size: "text-3xl to text-4xl", role: "Major section headers" },
    { tag: "H3", size: "text-xl to text-2xl", role: "Card titles & content group division" },
    { tag: "H4", size: "text-lg font-semibold", role: "Item & subsection headers" },
    { tag: "Body", size: "text-base leading-relaxed", role: "Comfortable long-form reading & service overviews" },
    { tag: "Supporting", size: "text-sm text-slate-600", role: "Metadata, timestamps, and captions" },
    { tag: "Technical", size: "text-xs font-mono uppercase", role: "Tech stack tags & category pills" },
  ],
};

export const LAYOUT_SPEC = {
  containerMaxWidth: "max-w-6xl", // 1152px / 72rem
  gridSystem: {
    bentoCols: "grid-cols-1 md:grid-cols-3",
    projectCols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    serviceCols: "grid-cols-1 md:grid-cols-2",
  },
  spacingScale: {
    pagePaddingY: "py-16 lg:py-24",
    pagePaddingX: "px-6 lg:px-8",
    sectionGap: "space-y-12 lg:space-y-16",
    cardPadding: "p-6 sm:p-8",
  },
};

export const COMPONENT_CATALOG = {
  level1_foundation: ["Container", "SectionWrapper", "Divider"],
  level2_navigation: ["SiteHeader", "NavMenu", "MobileMenu", "SiteFooter"],
  level3_content: ["Hero", "BentoCard", "ServiceCard", "ProjectCard", "CaseStudyCard", "ArticleCard", "TechPill"],
  level4_interaction: ["Button", "SearchInput", "Select", "Textarea", "Tabs", "ContactForm"],
  level5_advanced: ["HeroSkillRotation", "Timeline", "BrandLoader", "BentoGrid"],
};

export const MOTION_SPEC = {
  durations: {
    fast: 0.2,
    normal: 0.35,
    slow: 0.6,
    cinematic: 0.9,
  },
  easings: {
    luxuryReveal: [0.16, 1, 0.3, 1],
    easeOutCubic: [0.33, 1, 0.68, 1],
  },
  accessibility: {
    reducedMotionSupport: true,
    fallbackAnimation: "instant or simple opacity fade",
  },
};

export const RESPONSIVE_SPEC = {
  touchTargetMinSize: "44px by 44px",
  breakpoints: {
    mobile: "< 640px (single-column focused stream)",
    tablet: "640px - 1024px (balanced 2-column layout)",
    desktop: "> 1024px (multi-column immersive showcase)",
  },
};

export const ACCESSIBILITY_SPEC = {
  standard: "WCAG 2.1 AA",
  contrastRatioText: ">= 4.5:1 for normal text, >= 3:1 for large text",
  focusIndicators: "Visible focus ring on all interactive elements",
  keyboardNavigable: true,
  ariaA11y: "Semantic HTML5 landmarks and aria-live regions for dynamic state updates",
};
