import { cn } from "../../lib/utils";

export function Tabs({ activeTab, className, items, onChange, tabs, value }) {
  const tabList = items || tabs || [];
  const currentValue = value ?? activeTab;

  return (
    <div
      aria-label="Filter tabs"
      className={cn("flex flex-wrap gap-2", className)}
      role="tablist"
    >
      {tabList.map((item) => {
        const itemVal = item.value ?? item.id;
        const isSelected = currentValue === itemVal;
        return (
          <button
            aria-selected={isSelected}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition",
              isSelected
                ? "bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan"
                : "border border-white/[0.08] bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white hover:bg-white/[0.08]"
            )}
            key={itemVal}
            onClick={() => onChange(itemVal)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
