import type { Customer } from "../../models/customer";
import { fetchCustomersWithOrders } from "./fetchCustomersWithOrders";

export async function getAllCustomers(): Promise<Customer[]> {
  return fetchCustomersWithOrders();
}

export async function findCustomer(id: string | number): Promise<Customer> {
  const merged = await fetchCustomersWithOrders();
  const c = merged.find((x) => String(x.id) === String(id));
  if (!c) {
    throw new Error("Customer not found");
  }
  return c;
}
