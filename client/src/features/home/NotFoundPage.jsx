import { Link } from "react-router-dom";

import { Seo } from "../../components/common/Seo";
import { TextReveal } from "../../components/animations/TextReveal";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-28 text-center">
      <Seo title="Not found" />
      <p className="text-xs font-mono font-semibold uppercase tracking-[0.24em] text-cyan-400">
        <TextReveal as="span" variant="label">
          // 404 NOT FOUND
        </TextReveal>
      </p>
      <h1 className="font-display text-5xl font-bold tracking-tight text-white">
        <TextReveal as="span" variant="hero">
          That page is not here.
        </TextReveal>
      </h1>
      <TextReveal as="p" variant="body" className="text-base text-slate-300 max-w-md mx-auto">
        The destination you requested does not exist or has been relocated.
      </TextReveal>
      <div className="pt-2">
        <Link
          className="inline-flex rounded-full bg-cyan-500 text-slate-950 font-bold px-6 py-3 text-sm shadow-glow-cyan hover:bg-cyan-400 transition"
          to="/"
        >
          Return to portfolio &rarr;
        </Link>
      </div>
    </div>
  );
}
