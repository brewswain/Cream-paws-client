/**
 * Query key factories (TanStack Query v5).
 *
 * Invalidation strategy:
 * - Customer create/update/delete and order mutations should target `customerKeys.all`
 *   (or `listWithOrders` when you only need the merged list) so Customers, Orders, and
 *   Finance stay in sync — they all read `useCustomersWithOrdersQuery`.
 *
 * Cache policy numbers live in `queryDefaults.ts` + `queryClient` defaults (#22).
 */
export const customerKeys = {
  all: ["customers"] as const,
  listWithOrders: () => [...customerKeys.all, "listWithOrders"] as const,
};

/** Reserved for future dedicated `/api/orders`-only reads; mutations should invalidate `customerKeys.all`. */
export const orderKeys = {
  all: ["orders"] as const,
  list: () => [...orderKeys.all, "list"] as const,
};
