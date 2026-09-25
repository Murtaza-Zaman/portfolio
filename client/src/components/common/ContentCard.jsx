/**
 * ContentCard — Premium engineering project/content card in dark navy theme.
 * - Glassmorphism surface on dark background
 * - 3D CSS tilt effect on hover
 * - Cyan glow border on hover
 */
import { Link } from "react-router-dom";
import { TiltCard } from "../ui/TiltCard";
import { TechPill } from "../../design-system";

export function ContentCard({ description, eyebrow, href, image, meta, tags = [], title }) {
  const cardImage = image || null;
  const isExternal = Boolean(href && (href.startsWith("http://") || href.startsWith("https://")));

  const Inner = (
    <div className="flex h-full flex-col">
      {/* Cover image */}
      {cardImage && (
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] aspect-video mb-5">
          <img
            alt={title || "Project showcase"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            src={cardImage}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="space-y-2.5">
          {/* Eyebrow */}
          {eyebrow && (
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-400">
              {eyebrow}
            </p>
          )}

          {/* Title */}
          <h2 className="font-display text-xl font-semibold text-white leading-tight group-hover:text-cyan-300 transition-colors duration-200">
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-sm leading-relaxed text-slate-400 line-clamp-3">
              {description}
            </p>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <TechPill dark key={tag} label={tag} size="xs" />
              ))}
            </div>
          )}

          {meta && (
            <p className="text-xs text-slate-500 font-mono">
              {meta}
            </p>
          )}
        </div>

        {/* CTA link */}
        {href && (
          <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors duration-200">
            <span>View details</span>
            <span
              aria-hidden="true"
              className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
            >
              →
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const cardClasses =
    "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.05] hover:shadow-glow-cyan";

  if (!href) {
    return (
      <TiltCard>
        <article className={cardClasses} data-cursor="project">{Inner}</article>
      </TiltCard>
    );
  }

  return (
    <TiltCard>
      {isExternal ? (
        <a
          className={cardClasses}
          data-cursor="project"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <article>{Inner}</article>
        </a>
      ) : (
        <Link className={cardClasses} data-cursor="project" to={href}>
          <article>{Inner}</article>
        </Link>
      )}
    </TiltCard>
  );
}
