export function ContentState({ isLoading, error, empty = "No published content yet." }) {
  if (isLoading) {
    return <p aria-live="polite" className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 text-sm text-slate-400">Loading content...</p>;
  }

  if (error) {
    return <p aria-live="assertive" className="rounded-2xl border border-rose-500/20 bg-rose-500/10 backdrop-blur-sm p-6 text-sm text-rose-400" role="alert">This content is temporarily unavailable.</p>;
  }

  return <p aria-live="polite" className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-slate-400">{empty}</p>;
}
