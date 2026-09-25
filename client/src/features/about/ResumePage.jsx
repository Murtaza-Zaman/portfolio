import { Link } from "react-router-dom";

import { ContentState } from "../../components/common/ContentState";
import { PageIntro } from "../../components/common/PageIntro";
import { Seo } from "../../components/common/Seo";
import { useResume } from "../../hooks/usePublicContent";
import { buildBreadcrumbSchema } from "../../utils/seoSchemas";
import { TextReveal } from "../../components/animations/TextReveal";

export function ResumePage() {
  const query = useResume();
  const resumeBreadcrumb = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resume", url: "/resume" },
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-16 lg:px-8">
      <Seo
        canonicalPath="/resume"
        description="Professional resume, qualifications, and engineering experience for Murtaza Zaman."
        structuredData={resumeBreadcrumb}
        title="Resume"
      />
      <PageIntro
        dark
        description="A concise view of professional experience and capabilities."
        eyebrow="Professional document"
        title="Resume"
      />
      {query.isLoading || query.error ? (
        <ContentState error={query.error} isLoading={query.isLoading} />
      ) : (
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 shadow-2xl">
          <h2 className="font-display text-3xl font-semibold text-white">
            <TextReveal as="span" variant="hero">
              {query.data?.data?.title}
            </TextReveal>
          </h2>
          <p className="mt-3 text-slate-300">
            <TextReveal as="span" variant="body">
              {query.data?.data?.description}
            </TextReveal>
          </p>
          <a
            className="mt-7 inline-flex rounded-full bg-cyan-500 text-slate-950 font-bold px-6 py-3 text-sm shadow-glow-cyan hover:bg-cyan-400 transition"
            href={query.data?.data?.secureUrl}
            rel="noreferrer"
            target="_blank"
          >
            Open resume
          </a>
        </div>
      )}
      <Link className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors" to="/contact">
        Have a question? Start a conversation &rarr;
      </Link>
    </div>
  );
}
