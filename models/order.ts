/** Order row shape returned from Supabase (snake_case columns). */
export interface OrderFromSupabase {
  id: string;
  customer_id: string;
  delivery_date: string;
  delivery_cost: number | null;
  payment_made: boolean;
  payment_date: string;
  is_delivery: boolean;
  quantity: number;
  driver_paid: boolean;
  warehouse_paid: boolean;
  retail_price: number | null;
  services: unknown[];
  version: number;
  customers: { name: string };
}

/** Payload for creating an order (`services` required by API). */
export interface OrderCreateInput {
  customer_id: string;
  delivery_date: string;
  delivery_cost: number | null;
  payment_made: boolean;
  payment_date: string;
  is_delivery: boolean;
  quantity: number;
  driver_paid: boolean;
  warehouse_paid: boolean;
  retail_price: number | null;
  services: unknown[];
}

/** Full order shape for updates (optimistic locking via `version`). */
export interface OrderUpdatePayload {
  id: string;
  customer_id: string;
  delivery_date: string;
  delivery_cost: number | null;
  payment_made: boolean;
  payment_date: string;
  is_delivery: boolean;
  quantity: number;
  driver_paid: boolean;
  warehouse_paid: boolean;
  retail_price: number | null;
  services: unknown[];
  version: number;
}

/** @deprecated Use OrderFromSupabase — kept as alias for stores referencing today's shape. */
export type TodaysOrder = OrderFromSupabase;

export type OrdersByCustomer = Record<string, OrderFromSupabase[]>;

export function formatOrderSummaryLine(order: OrderFromSupabase): string {
  const services = order.services;
  if (!Array.isArray(services) || services.length === 0) {
    return `Order · qty ${order.quantity}`;
  }
  const first = services[0];
  if (first && typeof first === "object" && first !== null) {
    const rec = first as Record<string, unknown>;
    const label = rec.description ?? rec.name ?? rec.title;
    if (typeof label === "string" && label.trim()) {
      return `${label} × ${order.quantity}`;
    }
  }
  return `${services.length} service line(s) × ${order.quantity}`;
}

export function toOrderUpdatePayload(
  order: OrderFromSupabase
): OrderUpdatePayload {
  return {
    id: order.id,
    customer_id: order.customer_id,
    delivery_date: order.delivery_date,
    delivery_cost: order.delivery_cost,
    payment_made: order.payment_made,
    payment_date: order.payment_date,
    is_delivery: order.is_delivery,
    quantity: order.quantity,
    driver_paid: order.driver_paid,
    warehouse_paid: order.warehouse_paid,
    retail_price: order.retail_price,
    services: Array.isArray(order.services) ? order.services : [],
    version: order.version,
  };
}
