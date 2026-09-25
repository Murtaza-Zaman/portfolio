/**
 * Schema.org JSON-LD Structured Data Generators for SEO, GEO, and AEO
 */

const SITE_URL = "https://murtazazaman.com";

/**
 * Generates Person schema representing Murtaza Zaman
 */
export function buildPersonSchema(custom = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#murtazazaman`,
    name: "Murtaza Zaman",
    jobTitle: "Future Technology Builder & Software Engineer",
    description:
      "Software developer and technology builder specializing in modern web applications, SaaS platforms, cloud architecture, and SEO engineering.",
    url: SITE_URL,
    image: `${SITE_URL}/assets/avatar.jpg`,
    sameAs: [
      "https://github.com/murtazazaman",
      "https://linkedin.com/in/murtazazaman",
      "https://twitter.com/murtazazaman",
    ],
    knowsAbout: [
      "Software Development",
      "Full-Stack Web Engineering",
      "Cloud & Backend Architecture",
      "SaaS Platform Architecture",
      "Search Engine Optimization (SEO)",
      "React",
      "Node.js",
      "MongoDB",
      "Redis",
    ],
    ...custom,
  };
}

/**
 * Generates ProfessionalService schema for individual or catalog service offerings
 */
export function buildServiceSchema({
  description,
  name,
  providerName = "Murtaza Zaman",
  serviceType,
  url,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name,
    description,
    url: url ? (url.startsWith("http") ? url : `${SITE_URL}${url}`) : SITE_URL,
    serviceType: serviceType || name,
    provider: {
      "@type": "Person",
      name: providerName,
      url: SITE_URL,
    },
    areaServed: ["United States", "Middle East", "Worldwide"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Engineering Solutions",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name,
            description,
          },
        },
      ],
    },
  };
}

/**
 * Generates SoftwareApplication / CreativeWork schema for projects and case studies
 */
export function buildProjectSchema({
  applicationCategory,
  description,
  name,
  operatingSystem = "Web Browser",
  technologies = [],
  url,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: url ? (url.startsWith("http") ? url : `${SITE_URL}${url}`) : SITE_URL,
    applicationCategory: applicationCategory || "BusinessApplication",
    operatingSystem,
    author: {
      "@type": "Person",
      name: "Murtaza Zaman",
      url: SITE_URL,
    },
    softwareRequirements: technologies.join(", "),
  };
}

/**
 * Generates BlogPosting / TechArticle schema for insights
 */
export function buildArticleSchema({
  author = "Murtaza Zaman",
  dateModified,
  datePublished,
  description,
  headline,
  image,
  keywords = [],
  url,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline,
    description,
    url: url ? (url.startsWith("http") ? url : `${SITE_URL}${url}`) : SITE_URL,
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || datePublished || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Murtaza Zaman",
      url: SITE_URL,
    },
    image: image || `${SITE_URL}/og-image.jpg`,
    keywords: keywords.join(", "),
  };
}

/**
 * Generates BreadcrumbList schema for hierarchical navigation signals
 */
export function buildBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const target = item.url || item.item || "/";
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: target.startsWith("http") ? target : `${SITE_URL}${target}`,
      };
    }),
  };
}

/**
 * Generates FAQPage schema for Answer Engine Optimization (AEO)
 */
export function buildFaqSchema(qas = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
      },
    })),
  };
}
