import type { Customer } from "../../models/customer";

/**
 * Single shared empty list for TanStack Query `data` while loading or missing.
 * Do not use `const { data: customers = [] } = useQuery()` — a fresh `[]` each
 * render breaks `useMemo` / `useEffect` deps and can cause maximum update depth.
 */
export const EMPTY_CUSTOMER_LIST: Customer[] = [];

export function resolveCustomersQueryData(
  data: Customer[] | undefined
): Customer[] {
  return data ?? EMPTY_CUSTOMER_LIST;
}
