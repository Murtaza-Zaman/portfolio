import { Container } from "./Container";

export function Section({ children, className = "", tone = "default" }) {
  const tones = {
    default: "bg-[#f8fafc]",
    muted: "bg-slate-100",
    dark: "bg-slate-950 text-white",
  };

  return <section className={`${tones[tone]} ${className}`}><Container className="py-16 sm:py-20 lg:py-24">{children}</Container></section>;
}