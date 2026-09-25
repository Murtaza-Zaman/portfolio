/**
 * CapabilityChip — monospace tech/capability label chip.
 * Used in hero section and capability rows.
 */
import { clsx } from "clsx";

export function CapabilityChip({ label, variant = "dark", className = "" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1",
        "font-mono text-[10px] font-medium tracking-wider uppercase leading-none",
        variant === "dark"
          ? "bg-white/[0.07] text-slate-300 border border-white/[0.1]"
          : "bg-slate-100 text-slate-600 border border-slate-200/80",
        "transition-colors duration-200",
        className
      )}
    >
      {label}
    </span>
  );
}
