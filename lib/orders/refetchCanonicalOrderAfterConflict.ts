import { fetchCustomersWithOrders } from "../customers/fetchCustomersWithOrders";
import { queryClient } from "../queryClient";
import { customerKeys } from "../queryKeys";
import type { OrderFromSupabase } from "../../models/order";
import { flattenOrdersFromCustomers } from "./flattenOrdersFromCustomers";

/**
 * After a 409 on order update: invalidate merged list, refetch, return the latest row for `orderId`.
 */
export async function refetchCanonicalOrderAfterConflict(
  orderId: string
): Promise<OrderFromSupabase | undefined> {
  await queryClient.invalidateQueries({ queryKey: customerKeys.all });
  const customers = await queryClient.fetchQuery({
    queryKey: customerKeys.listWithOrders(),
    queryFn: fetchCustomersWithOrders,
  });
  const flat = flattenOrdersFromCustomers(customers);
  return flat.find((o) => o.id === orderId);
}
