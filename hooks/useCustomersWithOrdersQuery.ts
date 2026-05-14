import { useQuery } from "@tanstack/react-query";

import { fetchCustomersWithOrders } from "../lib/customers/fetchCustomersWithOrders";
import { customerKeys } from "../lib/queryKeys";

export function useCustomersWithOrdersQuery() {
  return useQuery({
    queryKey: customerKeys.listWithOrders(),
    queryFn: fetchCustomersWithOrders,
    staleTime: 60_000,
  });
}
