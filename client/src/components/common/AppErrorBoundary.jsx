import { Component } from "react";

import { Button } from "../ui/Button";

export class AppErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AppErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16">
        <div className="max-w-2xl w-full space-y-5 rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            Something went wrong
          </p>
          <h1 className="font-display text-3xl font-semibold text-slate-950">
            The workspace needs to reload.
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            The application could not safely render this view. Your saved content was not changed.
          </p>
          {this.state.error && (
            <div className="text-left rounded-xl bg-slate-900 p-4 text-xs font-mono text-rose-300 overflow-auto max-h-60">
              <p className="font-bold text-rose-400">{this.state.error.toString()}</p>
              {this.state.error.stack && (
                <pre className="mt-2 text-slate-400 whitespace-pre-wrap">{this.state.error.stack}</pre>
              )}
            </div>
          )}
          <Button onClick={this.handleReload}>Reload application</Button>
        </div>
      </main>
    );
  }
}