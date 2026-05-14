import { useQuery } from "@tanstack/react-query";

import { fetchCustomersWithOrders } from "../lib/customers/fetchCustomersWithOrders";
import { QUERY_GC_MS, QUERY_STALE_MS } from "../lib/queryDefaults";
import { customerKeys } from "../lib/queryKeys";

export function useCustomersWithOrdersQuery() {
  return useQuery({
    queryKey: customerKeys.listWithOrders(),
    queryFn: fetchCustomersWithOrders,
    staleTime: QUERY_STALE_MS.listWithOrders,
    gcTime: QUERY_GC_MS.listWithOrders,
  });
}
