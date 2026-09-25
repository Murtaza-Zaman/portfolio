import { forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

export const Textarea = forwardRef(function Textarea(
  {
    className,
    dark = true,
    error,
    helperText,
    id,
    label,
    required,
    rows = 4,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = error ? `${textareaId}-error` : undefined;
  const helperId = helperText ? `${textareaId}-helper` : undefined;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          className={cn(
            "block text-sm font-semibold",
            dark ? "text-slate-200" : "text-slate-800"
          )}
          htmlFor={textareaId}
        >
          {label}
          {required && <span className="ml-1 text-coral-500">*</span>}
        </label>
      )}
      <textarea
        aria-describedby={cn(errorId, helperId) || undefined}
        aria-invalid={Boolean(error)}
        className={cn(
          "w-full rounded-xl px-4 py-3 text-sm transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
          dark
            ? "border border-white/10 bg-[#071022] text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-500/20 disabled:bg-white/[0.02]"
            : "border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-teal-600/20 disabled:bg-slate-50",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
          className
        )}
        id={textareaId}
        ref={ref}
        required={required}
        rows={rows}
        {...props}
      />
      {error && (
        <p
          aria-live="polite"
          className="text-xs font-medium text-rose-500"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className={cn("text-xs", dark ? "text-slate-400" : "text-slate-500")} id={helperId}>
          {helperText}
        </p>
      )}
    </div>
  );
});
