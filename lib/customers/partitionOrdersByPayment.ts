import type { OrderFromSupabase } from "../../models/order";

export function partitionOrdersByPayment(orders: OrderFromSupabase[] | undefined) {
  const list = orders ?? [];
  const outstandingOrders = list.filter((o) => o.payment_made === false);
  const completedOrders = list
    .filter((o) => o.payment_made === true)
    .sort((a, b) => b.delivery_date.localeCompare(a.delivery_date));
  return { outstandingOrders, completedOrders };
}
