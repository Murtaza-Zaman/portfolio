import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * BentoGrid - High-impact responsive grid container for bento card layouts
 */
export function BentoGrid({
  children,
  className = "",
  columns = "md:grid-cols-3 lg:grid-cols-3",
  ...props
}) {
  return (
    <div
      className={twMerge(
        clsx("grid auto-rows-[minmax(220px,auto)] gap-6", columns, className)
      )}
      {...props}
    >
      {children}
    </div>
  );
}
