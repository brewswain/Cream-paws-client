/**
 * `listWithOrders` — HTTP GET `/api/customer` + `/api/orders`, merged for list UIs.
 * Orders tab and finance views derive rows from this key so a single invalidation refreshes all.
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
