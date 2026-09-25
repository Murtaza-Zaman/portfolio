import { Link } from "react-router-dom";

import {
  buildBreadcrumbSchema,
  buildProjectSchema,
  buildServiceSchema,
} from "../../utils/seoSchemas";
import { ContentState } from "./ContentState";
import { PageIntro } from "./PageIntro";
import { Reveal } from "./Reveal";
import { Seo } from "./Seo";
import { TextReveal } from "../animations/TextReveal";

export function DetailPage({ backLabel, backPath, eyebrow, fields, query, titleKey }) {
  const item = query.data?.data;

  if (query.isLoading || query.error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <ContentState error={query.error} isLoading={query.isLoading} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <ContentState empty="This published item is not available." />
      </div>
    );
  }

  const title = item[titleKey] || "Published Resource";
  const summary = item.summary || item.excerpt || "";
  const currentPath = `${backPath}/${item.slug}`;
  const sectionLabel = backLabel.replace(/Back to\s+/i, "");

  // Generate appropriate Schema.org schema based on resource type
  let entitySchema = null;
  if (backPath === "/services") {
    entitySchema = buildServiceSchema({
      name: title,
      description: summary,
      url: currentPath,
    });
  } else if (backPath === "/projects") {
    entitySchema = buildProjectSchema({
      name: title,
      description: summary,
      url: currentPath,
      technologies: item.technologies || [],
      applicationCategory: item.category,
    });
  }

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: sectionLabel, url: backPath },
    { name: title, url: currentPath },
  ]);

  const pageSchemas = entitySchema ? [entitySchema, breadcrumbs] : [breadcrumbs];

  return (
    <article className="mx-auto max-w-4xl space-y-10 px-6 py-16 lg:px-8">
      <Seo
        canonicalPath={currentPath}
        description={summary}
        structuredData={pageSchemas}
        title={title}
        type="website"
      />
      <Reveal>
        <PageIntro
          dark
          description={summary}
          eyebrow={eyebrow ?? item.category}
          title={title}
        />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="space-y-8 rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 shadow-2xl">
          {(item.coverImage || item.imageUrl) && (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] aspect-video max-h-[420px] w-full">
              <img
                alt={title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                src={item.coverImage || item.imageUrl}
              />
            </div>
          )}
          {fields.map(({ label, key }) =>
            item[key] ? (
              <section className="space-y-3" key={key}>
                <h2 className="font-display text-2xl font-semibold text-white">
                  <TextReveal as="span" variant="heading">
                    {label}
                  </TextReveal>
                </h2>
                <div className="whitespace-pre-line leading-8 text-slate-300">
                  <TextReveal as="div" variant="body">
                    {item[key]}
                  </TextReveal>
                </div>
              </section>
            ) : null
          )}
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <Link className="inline-flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors" to={backPath}>
          &larr; <span className="ml-1">{backLabel}</span>
        </Link>
      </Reveal>
    </article>
  );
}