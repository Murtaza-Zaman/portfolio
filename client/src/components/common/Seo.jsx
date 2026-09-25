import { useEffect } from "react";

const SITE_URL = "https://murtazazaman.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_DESCRIPTION =
  "Murtaza Zaman is a Future Technology Builder and Software Engineer with 5+ years of experience in Software Development, SEO Strategy, SaaS Development, and Cloud & Backend Architecture.";

function setMetaTag(name, content, attrName = "name") {
  if (!content) return;
  let element = document.querySelector(`meta[${attrName}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setCanonicalLink(href) {
  if (!href) return;
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function setJsonLdScript(structuredData) {
  let element = document.getElementById("json-ld-structured-data");
  if (!structuredData) {
    if (element) element.remove();
    return;
  }

  if (!element) {
    element = document.createElement("script");
    element.setAttribute("type", "application/ld+json");
    element.setAttribute("id", "json-ld-structured-data");
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(structuredData);
}

export function Seo({
  canonicalPath,
  canonicalUrl,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  keywords,
  robots = "index, follow",
  structuredData,
  title,
  type = "website",
}) {
  useEffect(() => {
    // Document title
    const fullTitle = title ? `${title} | Murtaza Zaman` : "Murtaza Zaman | Future Technology Builder";
    document.title = fullTitle;

    // Standard Meta
    setMetaTag("description", description);
    if (keywords) {
      const kwString = Array.isArray(keywords) ? keywords.join(", ") : keywords;
      setMetaTag("keywords", kwString);
    }
    setMetaTag("robots", robots);

    // Canonical link
    const resolvedCanonical =
      canonicalUrl || (canonicalPath ? `${SITE_URL}${canonicalPath.startsWith("/") ? "" : "/"}${canonicalPath}` : SITE_URL);
    setCanonicalLink(resolvedCanonical);

    // OpenGraph Meta
    setMetaTag("og:title", fullTitle, "property");
    setMetaTag("og:description", description, "property");
    setMetaTag("og:url", resolvedCanonical, "property");
    setMetaTag("og:type", type, "property");
    setMetaTag("og:image", image, "property");
    setMetaTag("og:site_name", "Murtaza Zaman - Technology Platform", "property");

    // Twitter Card Meta
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", fullTitle);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image);
    setMetaTag("twitter:creator", "@murtazazaman");

    // JSON-LD Structured Data
    setJsonLdScript(structuredData);

    return () => {
      // Optional cleanup on unmount if needed
    };
  }, [
    title,
    description,
    keywords,
    robots,
    canonicalPath,
    canonicalUrl,
    type,
    image,
    structuredData,
  ]);

  return null;
}
