import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * TechPill - Reusable badge component for tech stacks and skills
 */
export function TechPill({
  className = "",
  dark = false,
  label,
  size = "sm",
  variant = "default",
}) {
  const sizeStyles = {
    xs: "px-2 py-0.5 text-[11px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-sm",
  };

  const variantStyles = dark
    ? "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
    : variant === "accent"
      ? "border-coral-200 bg-coral-50 text-coral-800"
      : variant === "teal"
        ? "border-teal-200 bg-teal-50 text-teal-800"
        : "border-slate-200 bg-slate-100/80 text-slate-700 hover:border-slate-300";

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-full border font-mono font-medium transition-colors",
          sizeStyles[size] || sizeStyles.sm,
          variantStyles,
          className
        )
      )}
    >
      {label}
    </span>
  );
}
