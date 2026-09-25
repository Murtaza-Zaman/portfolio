export function Stack({ children, className = "", direction = "column" }) {
  return <div className={`flex gap-4 ${direction === "row" ? "flex-row items-center" : "flex-col"} ${className}`}>{children}</div>;
}
