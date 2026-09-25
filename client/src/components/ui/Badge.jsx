export function Badge({ children, className = "", tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    brand: "bg-teal-50 text-teal-800 border-teal-200",
    accent: "bg-rose-50 text-rose-800 border-rose-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-red-50 text-red-800 border-red-200",
  };

  const toneClass = tones[tone] || tones.neutral;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${toneClass} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

