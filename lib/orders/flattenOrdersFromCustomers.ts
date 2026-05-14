import type { Customer } from "../../models/customer";
import type { OrderFromSupabase } from "../../models/order";

/** Flatten merged customers+orders for list screens (orders tab, finance filters). */
export function flattenOrdersFromCustomers(
  customers: Customer[]
): OrderFromSupabase[] {
  return customers.flatMap((c) =>
    (c.orders ?? []).map((o) => ({
      ...o,
      customers: { name: c.name ?? o.customers?.name ?? "Unknown" },
    }))
  );
}
