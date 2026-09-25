import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { buildPersonSchema } from "../../utils/seoSchemas";
import { Seo } from "./Seo";

describe("Seo Component", () => {
  beforeEach(() => {
    document.title = "";
    document.head.innerHTML = "";
  });

  afterEach(() => {
    document.head.innerHTML = "";
  });

  it("updates document title with suffix when title is provided", () => {
    render(<Seo title="Projects" />);
    expect(document.title).toBe("Projects | Murtaza Zaman");
  });

  it("sets default title when title is omitted", () => {
    render(<Seo />);
    expect(document.title).toBe("Murtaza Zaman | Future Technology Builder");
  });

  it("sets standard meta tags (description, keywords, robots)", () => {
    render(
      <Seo
        description="Custom engineering portfolio description."
        keywords={["react", "node", "cloud"]}
        robots="noindex, nofollow"
      />
    );

    const descMeta = document.querySelector('meta[name="description"]');
    expect(descMeta).not.toBeNull();
    expect(descMeta.getAttribute("content")).toBe("Custom engineering portfolio description.");

    const kwMeta = document.querySelector('meta[name="keywords"]');
    expect(kwMeta).not.toBeNull();
    expect(kwMeta.getAttribute("content")).toBe("react, node, cloud");

    const robotsMeta = document.querySelector('meta[name="robots"]');
    expect(robotsMeta).not.toBeNull();
    expect(robotsMeta.getAttribute("content")).toBe("noindex, nofollow");
  });

  it("sets canonical link with canonicalPath", () => {
    render(<Seo canonicalPath="/projects/enterprise-saas" />);

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).not.toBeNull();
    expect(canonicalLink.getAttribute("href")).toBe(
      "https://murtazazaman.com/projects/enterprise-saas"
    );
  });

  it("sets canonical link with explicit canonicalUrl", () => {
    render(<Seo canonicalUrl="https://murtazazaman.com/custom-url" />);

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).not.toBeNull();
    expect(canonicalLink.getAttribute("href")).toBe("https://murtazazaman.com/custom-url");
  });

  it("sets OpenGraph and Twitter card meta tags", () => {
    render(
      <Seo
        canonicalPath="/insights/cloud-architecture"
        description="Deep dive into cloud systems."
        image="https://murtazazaman.com/images/cloud.jpg"
        title="Cloud Architecture"
        type="article"
      />
    );

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle.getAttribute("content")).toBe("Cloud Architecture | Murtaza Zaman");

    const ogDesc = document.querySelector('meta[property="og:description"]');
    expect(ogDesc.getAttribute("content")).toBe("Deep dive into cloud systems.");

    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType.getAttribute("content")).toBe("article");

    const ogImage = document.querySelector('meta[property="og:image"]');
    expect(ogImage.getAttribute("content")).toBe("https://murtazazaman.com/images/cloud.jpg");

    const ogUrl = document.querySelector('meta[property="og:url"]');
    expect(ogUrl.getAttribute("content")).toBe("https://murtazazaman.com/insights/cloud-architecture");

    const ogSiteName = document.querySelector('meta[property="og:site_name"]');
    expect(ogSiteName.getAttribute("content")).toBe("Murtaza Zaman - Technology Platform");

    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    expect(twitterCard.getAttribute("content")).toBe("summary_large_image");

    const twitterCreator = document.querySelector('meta[name="twitter:creator"]');
    expect(twitterCreator.getAttribute("content")).toBe("@murtazazaman");
  });

  it("injects and parses JSON-LD structured data script", () => {
    const personSchema = buildPersonSchema();
    render(<Seo structuredData={personSchema} />);

    const script = document.getElementById("json-ld-structured-data");
    expect(script).not.toBeNull();
    expect(script.getAttribute("type")).toBe("application/ld+json");

    const parsed = JSON.parse(script.textContent);
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@type"]).toBe("Person");
    expect(parsed.name).toBe("Murtaza Zaman");
  });

  it("removes JSON-LD script if structuredData is null/undefined", () => {
    const { rerender } = render(<Seo structuredData={{ "@type": "Thing" }} />);
    expect(document.getElementById("json-ld-structured-data")).not.toBeNull();

    rerender(<Seo structuredData={null} />);
    expect(document.getElementById("json-ld-structured-data")).toBeNull();
  });
});
