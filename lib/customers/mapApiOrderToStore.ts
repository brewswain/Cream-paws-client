import type { OrderFromSupabase } from "../../models/order";
import type { OrderApi } from "../../schemas/orderApi";

export function mapApiOrderToStore(
  api: OrderApi,
  customerName: string
): OrderFromSupabase {
  return {
    id: api.id,
    customer_id: api.customerId,
    delivery_date: api.deliveryDate,
    delivery_cost: api.deliveryCost ?? null,
    payment_made: api.paymentMade,
    payment_date: api.paymentDate,
    is_delivery: api.isDelivery,
    quantity: api.quantity,
    driver_paid: api.driverPaid,
    warehouse_paid: api.warehousePaid,
    retail_price: api.retailPrice ?? null,
    services: api.services,
    version: api.version,
    customers: { name: customerName },
  };
}
