import type { Customer } from "../../models/customer";
import type { CustomerListItem } from "../../schemas/customerList";
import type { OrderApi } from "../../schemas/orderApi";
import { mapApiOrderToStore } from "./mapApiOrderToStore";

/**
 * Joins HTTP customer rows with HTTP orders so list UI can split by open orders.
 */
export function mergeOrdersIntoCustomers(
  customers: CustomerListItem[],
  orders: OrderApi[]
): Customer[] {
  const nameById = new Map(
    customers.map((c) => [c.id, c.name] as const)
  );

  const bucket = new Map<string, ReturnType<typeof mapApiOrderToStore>[]>();
  for (const o of orders) {
    const list = bucket.get(o.customerId) ?? [];
    list.push(
      mapApiOrderToStore(o, nameById.get(o.customerId) ?? "Unknown")
    );
    bucket.set(o.customerId, list);
  }

  return customers.map((c) => ({
    id: c.id,
    name: c.name,
    contactNumber: c.contactNumber,
    location: c.location,
    city: c.city,
    orders: bucket.get(c.id) ?? [],
  }));
}
