import { Suspense } from "react";

import { AppProviders } from "./providers";
import { AppErrorBoundary } from "../components/common/AppErrorBoundary";
import { RouteFallback } from "../components/common/RouteFallback";
import { AppRouter } from "../routes";

export function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <Suspense fallback={<RouteFallback />}>
          <AppRouter />
        </Suspense>
      </AppProviders>
    </AppErrorBoundary>
  );
}
