import { QueryClient } from "@tanstack/react-query";

import { QUERY_GC_MS, QUERY_STALE_MS } from "./queryDefaults";

/**
 * Global defaults: RN has no browser “window focus”; disabling avoids surprise
 * refetches when the app resumes. Entity-specific `staleTime` / `gcTime` live in
 * `queryDefaults.ts` and are mirrored here for queries that omit overrides.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: QUERY_STALE_MS.listWithOrders,
      gcTime: QUERY_GC_MS.listWithOrders,
      refetchOnWindowFocus: false,
    },
  },
});
