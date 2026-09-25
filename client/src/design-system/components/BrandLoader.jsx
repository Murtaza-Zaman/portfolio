import { clsx } from "clsx";

/**
 * BrandLoader - Accessible cinematic loading screen
 */
export function BrandLoader({
  className = "",
  label = "Initializing Murtaza Zaman Platform...",
}) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={clsx(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-500",
        className
      )}
      role="status"
    >
      <div className="relative flex flex-col items-center space-y-6">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-teal-500/20 animate-ping" />
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <span className="font-display text-xl font-bold text-white tracking-tight">
              MZ
            </span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="font-display text-lg font-medium text-slate-200">
            Murtaza Zaman
          </p>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-teal-400">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
