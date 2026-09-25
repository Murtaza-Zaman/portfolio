import { TextReveal } from "../animations/TextReveal";

/**
 * PageIntro — Premium section header with GSAP SplitText typography.
 * Eyebrow: monospace cyan prefix (terminal boot)
 * Title: large display, tight tracking (cinematic character reveal)
 * Description: relaxed, constrained width (word-based rise)
 */
export function PageIntro({ description, eyebrow, title, dark = false, className = "" }) {
  return (
    <div className={`space-y-4 max-w-3xl ${className}`}>
      {eyebrow && (
        <p
          className={`font-mono text-[11px] font-medium uppercase tracking-[0.2em] flex items-center gap-2 ${
            dark ? "text-cyan-400" : "text-cyan-600"
          }`}
        >
          <span className={dark ? "text-slate-500" : "text-slate-400"} aria-hidden="true">
            //
          </span>{" "}
          <TextReveal as="span" variant="label" delay={0.05}>
            {eyebrow}
          </TextReveal>
        </p>
      )}
      {title && (
        <h1
          className={`font-display text-4xl font-semibold leading-tight tracking-tighter sm:text-5xl ${
            dark ? "text-white" : "text-slate-950"
          }`}
        >
          <TextReveal as="span" variant="hero" delay={0.12}>
            {title}
          </TextReveal>
        </h1>
      )}
      {description && (
        <p
          className={`text-lg leading-relaxed max-w-2xl ${
            dark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          <TextReveal as="span" variant="body" delay={0.25}>
            {description}
          </TextReveal>
        </p>
      )}
    </div>
  );
}
