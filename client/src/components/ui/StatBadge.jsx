/**
 * StatBadge — Metric display badge for high-impact figures.
 */
export function StatBadge({ icon: Icon, label, value, variant: _variant = "dark", className = "" }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-4 text-white transition-all duration-300 hover:border-cyan-500/30 hover:shadow-glow-cyan ${className}`}
    >
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div>
        <div className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
          {label}
        </div>
        <div className="text-lg font-bold tracking-tight text-white">{value}</div>
      </div>
    </div>
  );
}
