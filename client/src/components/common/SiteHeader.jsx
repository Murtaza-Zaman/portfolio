/**
 * SiteHeader — premium transparent→frosted glass navigation.
 * - Transparent at top, frosted on scroll
 * - Hides on scroll-down, reveals on scroll-up (GSAP)
 * - Magnetic CTA button
 * - Mobile: clean slide-in panel
 */
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useGSAP } from "@gsap/react";

import { PRIMARY_NAVIGATION } from "../../constants/navigation";
import { ROUTES } from "../../constants/routes";
import { gsap, ScrollTrigger } from "../../lib/gsap";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  // Track scroll state for glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP hide-on-scroll-down / reveal-on-scroll-up
  useGSAP(() => {
    const header = headerRef.current;
    let lastY = 0;

    ScrollTrigger.create({
      onUpdate: (self) => {
        const currentY = self.scroll();
        const scrollingDown = currentY > lastY && currentY > 80;
        gsap.to(header, {
          y: scrollingDown ? "-110%" : "0%",
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
        lastY = currentY;
      },
    });
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050c1a]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ willChange: "transform" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        {/* Logo mark */}
        <Link
          className="group flex items-center gap-2.5"
          to={ROUTES.PUBLIC.HOME}
        >
          {/* Monogram */}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white border border-white/20 font-mono text-sm font-bold tracking-tighter group-hover:border-cyan-500/40 transition-all duration-300">
            mz
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-white transition-colors duration-300">
            Murtaza Zaman
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          aria-controls="primary-navigation"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          className="min-h-11 min-w-11 rounded-lg p-2 md:hidden text-white transition-colors"
          onClick={() => setIsOpen((o) => !o)}
          type="button"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex md:items-center md:gap-1"
          id="primary-navigation"
        >
          {PRIMARY_NAVIGATION.map(({ label, path }) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-cyan-400 bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`
              }
              key={path}
              to={path}
            >
              {label}
            </NavLink>
          ))}
          <Link
            data-magnetic
            className="ml-3 rounded-full bg-cyan-500 text-slate-950 font-bold px-5 py-2.5 text-sm shadow-glow-cyan hover:bg-cyan-400 transition-all duration-200"
            onClick={() => setIsOpen(false)}
            to={ROUTES.PUBLIC.CONTACT}
          >
            Let&apos;s talk
          </Link>
        </nav>

        {/* Mobile navigation panel */}
        {isOpen && (
          <nav
            aria-label="Primary navigation"
            className="absolute left-0 right-0 top-full flex flex-col gap-1 border-b border-white/10 bg-[#050c1a]/95 backdrop-blur-2xl px-5 py-4 shadow-2xl md:hidden"
            id="primary-navigation"
          >
            {PRIMARY_NAVIGATION.map(({ label, path }) => (
              <NavLink
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-cyan-400 bg-white/10"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                  }`
                }
                key={path}
                onClick={() => setIsOpen(false)}
                to={path}
              >
                {label}
              </NavLink>
            ))}
            <Link
              className="mt-2 rounded-full bg-cyan-500 text-slate-950 font-bold px-5 py-3 text-center text-sm shadow-glow-cyan hover:bg-cyan-400 transition-colors"
              onClick={() => setIsOpen(false)}
              to={ROUTES.PUBLIC.CONTACT}
            >
              Let&apos;s talk
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
