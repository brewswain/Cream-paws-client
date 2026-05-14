import type { OrderUpdatePayload } from "../../models/order";

/** PUT `/api/orders/:id` body (camelCase, matches list DTO). */
export function mapOrderUpdatePayloadToApiPayload(payload: OrderUpdatePayload) {
  return {
    customerId: payload.customer_id,
    deliveryDate: payload.delivery_date,
    deliveryCost: payload.delivery_cost,
    paymentMade: payload.payment_made,
    paymentDate: payload.payment_date,
    isDelivery: payload.is_delivery,
    quantity: payload.quantity,
    driverPaid: payload.driver_paid,
    warehousePaid: payload.warehouse_paid,
    retailPrice: payload.retail_price,
    services: payload.services,
    version: payload.version,
  };
}
