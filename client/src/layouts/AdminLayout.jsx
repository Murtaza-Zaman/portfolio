import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { ADMIN_NAVIGATION } from "../constants/navigation";
import { useAuthStore } from "../store/authStore";

export function AdminLayout() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#050c1a] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#050c1a]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              className="group flex items-center gap-2.5 font-mono text-sm font-semibold tracking-wider text-white"
              to="/admin"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 font-mono text-xs font-bold text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition group-hover:border-cyan-400 group-hover:bg-cyan-500/20">
                MZ
              </span>
              <span className="tracking-widest">PORTFOLIO // CMS</span>
              <span className="rounded-md border border-cyan-400/30 bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300">
                ADMIN
              </span>
            </Link>

            <div className="hidden items-center gap-2 border-l border-white/10 pl-4 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
                SYS.STATUS: <span className="text-emerald-400">NOMINAL</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-mono font-medium text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300"
              to="/"
            >
              <span>View live site</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Button onClick={logout} variant="secondary">
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-6 sm:px-6 lg:flex-row lg:px-8">
        <aside className="w-full shrink-0 lg:w-60">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2 backdrop-blur-xl">
            <nav
              aria-label="Admin navigation"
              className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:pb-0"
            >
              {ADMIN_NAVIGATION.map(({ label, path }) => (
                <NavLink
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider transition ${
                      isActive
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                    }`
                  }
                  end={path === "/admin"}
                  key={path}
                  to={path}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
