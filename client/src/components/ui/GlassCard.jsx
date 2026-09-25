/**
 * GlassCard — Glassmorphism card with glow border variant in dark navy theme.
 */
import { clsx } from "clsx";

export function GlassCard({
  children,
  className = "",
  glow = false,
  variant = "dark",
  padding = "p-7",
  ...props
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl transition-all duration-300",
        variant === "dark"
          ? "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/30 text-white"
          : "bg-white/90 backdrop-blur-sm border border-slate-200/80 hover:border-slate-300",
        glow && "hover:shadow-glow-cyan hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]",
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
