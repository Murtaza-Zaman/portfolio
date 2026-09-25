import {
  Activity,
  ArrowRight,
  Cpu,
  FolderGit2,
  LayoutGrid,
  MessageSquare,
  Network,
  Settings,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Seo } from "../../components/common/Seo";
import { ADMIN_NAVIGATION } from "../../constants/navigation";
import { useAuthStore } from "../../store/authStore";
import { TextReveal } from "../../components/animations/TextReveal";

const RESOURCE_ICONS = {
  hero: Sparkles,
  profile: Sparkles,
  projects: FolderGit2,
  services: Cpu,
  showcasecards: LayoutGrid,
  nodegraph: Network,
  technodes: Network,
  messages: MessageSquare,
  settings: Settings,
};

export function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const resourceAreas = ADMIN_NAVIGATION.filter((item) => item.path !== "/admin");

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-5 py-8 sm:px-6 lg:px-8">
      <Seo title="Operations Console // Admin" />

      {/* Hero Header */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          <TextReveal as="span" variant="label">
            SYS.OPS // CONTROL CENTER
          </TextReveal>
        </div>

        <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          <TextReveal as="span" variant="hero">
            {`Operations Console${user?.displayName ? `, ${user.displayName}` : ""}.`}
          </TextReveal>
        </h1>
        <TextReveal as="p" variant="body" className="max-w-2xl text-base leading-relaxed text-slate-400">
          Centralized management for projects, services, settings, and inbound client inquiries.
        </TextReveal>

        {/* Live HUD Telemetry Strip */}
        <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4 font-mono text-xs">
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 backdrop-blur-xl">
            <Activity className="text-cyan-400" size={16} />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">CLUSTER</div>
              <div className="font-semibold text-slate-200">PRODUCTION</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 backdrop-blur-xl">
            <Terminal className="text-emerald-400" size={16} />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">DATABASE</div>
              <div className="font-semibold text-emerald-400">CONNECTED</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 backdrop-blur-xl">
            <Cpu className="text-purple-400" size={16} />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">PIPELINE</div>
              <div className="font-semibold text-slate-200">AUTOMATED</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 backdrop-blur-xl">
            <Settings className="text-amber-400" size={16} />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">CMS ENGINE</div>
              <div className="font-semibold text-slate-200">V2.4 ACTIVE</div>
            </div>
          </div>
        </div>
      </header>

      {/* Resource Areas Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resourceAreas.map(({ description, label, path, resource }, idx) => {
          const Icon = RESOURCE_ICONS[resource] || Terminal;
          const indexStr = String(idx + 1).padStart(2, "0");

          return (
            <Link
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]"
              key={path}
              to={path}
            >
              {/* Corner accent glow on hover */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/10 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-cyan-400 transition-colors group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10">
                    <Icon size={18} />
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-slate-500 tracking-wider">
                    <TextReveal as="span" variant="label">
                      {`DOMAIN // ${indexStr}`}
                    </TextReveal>
                  </span>
                </div>

                <h2 className="mt-5 font-display text-2xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  <TextReveal as="span" variant="heading">
                    {label}
                  </TextReveal>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  <TextReveal as="span" variant="body">
                    {description}
                  </TextReveal>
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 pt-4 border-t border-white/[0.06] font-mono text-xs font-semibold text-cyan-400">
                <span>Manage {label}</span>
                <ArrowRight className="transition-transform group-hover:translate-x-1" size={13} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}