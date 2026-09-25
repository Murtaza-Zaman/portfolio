import { Search, X } from "lucide-react";
import { cn } from "../../lib/utils";

export function SearchInput({
  className,
  onChange,
  onClear,
  placeholder = "Search...",
  value = "",
  ...props
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        size={18}
      />
      <input
        aria-label={placeholder}
        className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-2.5 pl-10 pr-9 text-sm text-white placeholder:text-slate-500 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        onChange={onChange}
        placeholder={placeholder}
        type="search"
        value={value}
        {...props}
      />
      {value && (
        <button
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-white transition"
          onClick={onClear}
          type="button"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
