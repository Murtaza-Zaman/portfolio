import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MessageCircle,
  Disc,
  Globe,
  ExternalLink,
} from "lucide-react";

export const SOCIAL_COLOR_VARIANTS = {
  cyan: {
    base: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]",
    hover: "hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.55)]",
    ring: "focus-visible:ring-cyan-400",
    labelBg: "bg-cyan-950 text-cyan-300 border-cyan-500/30",
  },
  purple: {
    base: "border-purple-500/40 bg-purple-500/10 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.2)]",
    hover: "hover:border-purple-400 hover:bg-purple-500/20 hover:text-purple-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.55)]",
    ring: "focus-visible:ring-purple-400",
    labelBg: "bg-purple-950 text-purple-300 border-purple-500/30",
  },
  sky: {
    base: "border-sky-500/40 bg-sky-500/10 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.2)]",
    hover: "hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-300 hover:shadow-[0_0_20px_rgba(14,165,233,0.55)]",
    ring: "focus-visible:ring-sky-400",
    labelBg: "bg-sky-950 text-sky-300 border-sky-500/30",
  },
  emerald: {
    base: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    hover: "hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.55)]",
    ring: "focus-visible:ring-emerald-400",
    labelBg: "bg-emerald-950 text-emerald-300 border-emerald-500/30",
  },
  amber: {
    base: "border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    hover: "hover:border-amber-400 hover:bg-amber-500/20 hover:text-amber-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.55)]",
    ring: "focus-visible:ring-amber-400",
    labelBg: "bg-amber-950 text-amber-300 border-amber-500/30",
  },
  rose: {
    base: "border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
    hover: "hover:border-rose-400 hover:bg-rose-500/20 hover:text-rose-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.55)]",
    ring: "focus-visible:ring-rose-400",
    labelBg: "bg-rose-950 text-rose-300 border-rose-500/30",
  },
};

export function getSocialIcon(platform = "") {
  const norm = String(platform).toLowerCase().trim();
  if (norm.includes("git")) return Github;
  if (norm.includes("linkedin")) return Linkedin;
  if (norm.includes("twit") || norm.includes("x") || norm === "x") return Twitter;
  if (norm.includes("insta")) return Instagram;
  if (norm.includes("you") || norm.includes("yt")) return Youtube;
  if (norm.includes("mail") || norm.includes("email")) return Mail;
  if (norm.includes("whats") || norm.includes("wa")) return MessageCircle;
  if (norm.includes("disc")) return Disc;
  if (norm.includes("site") || norm.includes("web") || norm.includes("glob")) return Globe;
  return ExternalLink;
}
