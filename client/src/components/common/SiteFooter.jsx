/**
 * SiteFooter — Premium dark navy footer.
 * Brand mark + positioning | Navigation | Availability status + CTA
 */
import { Link } from "react-router-dom";

import { brand } from "../../constants/brand";
import { ROUTES } from "../../constants/routes";
import { useProfile } from "../../hooks/usePublicContent";

const NAV_COLS = [
  {
    title: "Navigation",
    links: [
      { label: "About", path: "/about" },
      { label: "Services", path: "/services" },
      { label: "Projects", path: "/projects" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Resume", path: "/resume" },
      { label: "Contact", path: "/contact" },
    ],
  },
];

export function SiteFooter() {
  const profile = useProfile();
  const socialLinks = profile.data?.data?.socialLinks ?? [];

  return (
    <footer className="bg-transparent text-slate-400 border-t border-white/[0.06]">
      {/* Top glow line */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto_auto_auto]">

          {/* Brand column */}
          <div className="space-y-5">
            {/* Logo mark */}
            <Link className="inline-flex items-center gap-2.5 group" to={ROUTES.PUBLIC.HOME}>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.07] font-mono text-sm font-bold text-white border border-white/[0.1] group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 transition-all duration-300">
                mz
              </span>
              <span className="font-display text-base font-semibold text-white tracking-tight">
                Murtaza Zaman
              </span>
            </Link>

            <p className="text-sm leading-6 text-slate-400 max-w-xs">
              {brand.positioning}
            </p>

            {/* Tech stack used */}
            <div className="flex flex-wrap gap-2 pt-1">
              {["React 19", "Node.js", "GSAP", "Tailwind", "MongoDB"].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-white/[0.05] px-2.5 py-0.5 font-mono text-[10px] text-slate-500 border border-white/[0.06]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          {NAV_COLS.map(({ title, links }) => (
            <div key={title} className="space-y-4">
              <ul className="space-y-3">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                      to={path}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Availability + Contact */}
          <div className="space-y-5 lg:min-w-[180px]">
            {/* Availability indicator */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-teal-500/20 bg-teal-500/[0.08] px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
              </span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-teal-400">
                Available
              </span>
            </div>

            <p className="text-xs leading-5 text-slate-500">
              Open to freelance, contract, and full-time opportunities.
            </p>

            {/* Social links if any */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 pt-1">
                {socialLinks.map((link) => (
                  <a
                    className="text-xs text-slate-500 hover:text-white transition-colors"
                    href={link.url}
                    key={link.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/[0.06] pt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] text-slate-600 tracking-wide">
            © {new Date().getFullYear()} Murtaza Zaman — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
