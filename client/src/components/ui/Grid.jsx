export function Grid({ children, className = "" }) {
  return <div className={`grid gap-5 ${className}`}>{children}</div>;
}
