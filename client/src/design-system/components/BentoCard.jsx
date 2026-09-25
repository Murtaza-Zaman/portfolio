import { clsx } from "clsx";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import { TechPill } from "./TechPill";
import { TextReveal } from "../../components/animations/TextReveal";

/**
 * BentoCard - Modular, high-aesthetic card primitive for capability showcases
 */
export function BentoCard({
  actionLabel = "Explore",
  children,
  className = "",
  colSpan = "col-span-1",
  description,
  eyebrow,
  href,
  icon: Icon,
  rowSpan = "row-span-1",
  tags = [],
  title,
  variant = "default",
  ...props
}) {
  const variantStyles = {
    default:
      "border-white/[0.08] bg-white/[0.03] text-white hover:border-cyan-500/30 hover:bg-white/[0.05] hover:shadow-glow-cyan",
    highlight:
      "border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-white/[0.03] to-transparent text-white hover:border-cyan-500/50 hover:shadow-glow-cyan",
    dark:
      "border-white/[0.08] bg-white/[0.03] text-white hover:border-cyan-500/30 hover:bg-white/[0.05] hover:shadow-glow-cyan",
    accent:
      "border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-white/[0.03] to-transparent text-white hover:border-rose-500/50",
  };

  const isDark = true;

  const cardContent = (
    <div className="flex h-full flex-col justify-between p-7">
      <div>
        <div className="flex items-center justify-between gap-4">
          {eyebrow && (
            <TextReveal
              as="span"
              variant="label"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400 font-mono"
            >
              {eyebrow}
            </TextReveal>
          )}
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 transition-colors">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>

        {title && (
          <TextReveal
            as="h3"
            variant="heading"
            className="mt-4 font-display text-2xl font-semibold tracking-tight text-white"
          >
            {title}
          </TextReveal>
        )}

        {description && (
          <TextReveal
            as="p"
            variant="body"
            className={clsx(
              "mt-3 text-sm leading-relaxed",
              isDark ? "text-slate-300" : "text-slate-600"
            )}
          >
            {description}
          </TextReveal>
        )}

        {children && <div className="mt-4">{children}</div>}
      </div>

      <div className="mt-6 space-y-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <TechPill dark={isDark} key={tag} label={tag} />
            ))}
          </div>
        )}

        {href && (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 transition-transform group-hover:translate-x-1">
            <span>{actionLabel}</span>
            <span>&rarr;</span>
          </div>
        )}
      </div>
    </div>
  );

  const containerClasses = twMerge(
    clsx(
      "group relative overflow-hidden rounded-3xl border transition-all duration-300 backdrop-blur-sm",
      colSpan,
      rowSpan,
      variantStyles[variant] || variantStyles.default,
      className
    )
  );

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          className={containerClasses}
          href={href}
          rel="noreferrer"
          target="_blank"
          {...props}
        >
          {cardContent}
        </a>
      );
    }
    return (
      <Link className={containerClasses} to={href} {...props}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={containerClasses} {...props}>
      {cardContent}
    </div>
  );
}
