import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

const styles = {
  primary: "bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shadow-glow-cyan",
  secondary: "border border-white/15 bg-white/[0.05] text-white hover:border-cyan-500/40 hover:bg-white/[0.1]",
  quiet: "text-cyan-400 hover:text-cyan-300",
};

export function Button({ children, className = "", href, onClick, type = "button", variant = "primary", disabled = false, ...props }) {
  const buttonClasses = cn(
    "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    styles[variant] || styles.primary,
    className
  );

  if (href) {
    return <Link className={buttonClasses} to={href} {...props}>{children}</Link>;
  }

  return <button className={buttonClasses} disabled={disabled} onClick={onClick} type={type} {...props}>{children}</button>;
}