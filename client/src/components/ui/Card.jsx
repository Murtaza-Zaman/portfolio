import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Card = forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 shadow-xl text-slate-100 transition hover:border-white/[0.15]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

export const CardHeader = forwardRef(function CardHeader({ className, ...props }, ref) {
  return <div className={cn("space-y-1.5 pb-4", className)} ref={ref} {...props} />;
});

export const CardTitle = forwardRef(function CardTitle({ className, ...props }, ref) {
  return (
    <h3
      className={cn("font-display text-xl font-semibold tracking-tight text-white", className)}
      ref={ref}
      {...props}
    />
  );
});

export const CardDescription = forwardRef(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      className={cn("text-sm leading-6 text-slate-400", className)}
      ref={ref}
      {...props}
    />
  );
});

export const CardContent = forwardRef(function CardContent({ className, ...props }, ref) {
  return <div className={cn("pt-0", className)} ref={ref} {...props} />;
});

export const CardFooter = forwardRef(function CardFooter({ className, ...props }, ref) {
  return (
    <div
      className={cn("flex items-center pt-4 text-sm font-semibold text-cyan-400", className)}
      ref={ref}
      {...props}
    />
  );
});
