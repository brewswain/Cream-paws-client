/**
 * TanStack Query tuning for server-backed lists (see GitHub #22).
 *
 * - `listWithOrders` backs Customers, Orders, and Finance list UIs via
 *   `useCustomersWithOrdersQuery` and `customerKeys.listWithOrders`.
 * - Adjust here so all consumers stay aligned; override per-query only when a
 *   screen needs tighter freshness.
 */
export const QUERY_STALE_MS = {
  listWithOrders: 60_000,
} as const;

/** Time unused cached data stays in memory before garbage collection. */
export const QUERY_GC_MS = {
  listWithOrders: 5 * 60_000,
} as const;
