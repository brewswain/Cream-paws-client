export function pickCustomerFromMergedList<T extends { id: string | number }>(
  customers: T[],
  id: string | number
): T | undefined {
  return customers.find((c) => String(c.id) === String(id));
}
