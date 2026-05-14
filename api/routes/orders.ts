import {
  OrderCreateInput,
  OrderFromSupabase,
  OrderUpdatePayload,
  OrdersByCustomer,
  toOrderUpdatePayload,
} from "../../models/order";
import { axiosInstance } from "../http";
import { mapApiOrderToStore } from "../../lib/customers/mapApiOrderToStore";
import { queryClient } from "../../lib/queryClient";
import { customerKeys } from "../../lib/queryKeys";
import { orderListResponseSchema } from "../../schemas/orderApi";
import { orderCreateRequestSchema } from "../../schemas/orderCreate";
import { putOrderUpdateHttp } from "../../lib/orders/putOrderUpdateHttp";

export const getAllOrders = async (): Promise<OrderFromSupabase[]> => {
  const res = await axiosInstance.get<unknown[]>("/api/orders");
  const parsed = orderListResponseSchema.parse(res.data);
  return parsed.map((o) => mapApiOrderToStore(o, "Unknown"));
};

export const createOrder = async (payload: OrderCreateInput) => {
  if (!Array.isArray(payload.services) || payload.services.length === 0) {
    throw new Error("services must be a non-empty array");
  }

  const body = orderCreateRequestSchema.parse({
    customerId: String(payload.customer_id),
    deliveryDate: payload.delivery_date,
    deliveryCost: payload.delivery_cost,
    paymentMade: !!payload.payment_made,
    paymentDate: payload.payment_date ?? "",
    isDelivery: !!payload.is_delivery,
    quantity: payload.quantity ?? 1,
    driverPaid: !!payload.driver_paid,
    warehousePaid: !!payload.warehouse_paid,
    retailPrice: payload.retail_price,
    services: payload.services,
  });

  await axiosInstance.post("/api/orders", body);
  await queryClient.invalidateQueries({ queryKey: customerKeys.all });
};

export const deleteOrder = async (id: string) => {
  const list = await getAllOrders();
  const row = list.find((o) => o.id === id);
  if (!row) {
    throw new Error("Order not found");
  }
  const payload = toOrderUpdatePayload({
    ...row,
    payment_made: true,
    payment_date: new Date().toISOString().split("T")[0],
  });
  await putOrderUpdateHttp(payload, row.customers.name);
  await queryClient.invalidateQueries({ queryKey: customerKeys.all });
};

export const deleteCustomersOrder = async (
  orderId: string,
  customerId: string
) => {
  try {
    const response = await axiosInstance.delete("/api/orders/customer", {
      data: { customerId, orderId },
    });
    await queryClient.invalidateQueries({ queryKey: customerKeys.all });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getTodaysOrders = async () => {
  const today = new Date().toISOString().split("T")[0];
  const list = await getAllOrders();
  const rows = list.filter((o) => o.delivery_date === today);
  const ordersByCustomer: OrdersByCustomer = rows.reduce(
    (acc: OrdersByCustomer, order) => {
      const customerName = order.customers?.name ?? "Unknown";
      if (!acc[customerName]) {
        acc[customerName] = [];
      }
      acc[customerName].push(order);
      return acc;
    },
    {}
  );

  return ordersByCustomer;
};

export const getFinanceScreenOrders = async () => {
  const list = await getAllOrders();
  const unpaidWarehouseOrders = list.filter(
    (order) => order.warehouse_paid === false
  );
  const unpaidCourierFees = list.filter(
    (order) => order.driver_paid === false
  );

  return { unpaidWarehouseOrders, unpaidCourierFees };
};

export const payDeliveryFees = async (orderIds: string[]) => {
  for (const orderId of orderIds) {
    const list = await getAllOrders();
    const row = list.find((o) => o.id === orderId);
    if (!row) {
      continue;
    }
    const payload = toOrderUpdatePayload({ ...row, driver_paid: true });
    await putOrderUpdateHttp(payload, row.customers.name);
  }
  await queryClient.invalidateQueries({ queryKey: customerKeys.all });
};

export const payWarehouseOrders = async (orderIds: string[]) => {
  for (const orderId of orderIds) {
    const list = await getAllOrders();
    const row = list.find((o) => o.id === orderId);
    if (!row) {
      continue;
    }
    const payload = toOrderUpdatePayload({ ...row, warehouse_paid: true });
    await putOrderUpdateHttp(payload, row.customers.name);
  }
  await queryClient.invalidateQueries({ queryKey: customerKeys.all });
};

export const getCustomersOrders = async (customerId: string | number) => {
  const list = await getAllOrders();
  return list
    .filter((o) => String(o.customer_id) === String(customerId))
    .sort((a, b) => b.delivery_date.localeCompare(a.delivery_date));
};

export const setPaymentMade = async (orderId: string) => {
  const list = await getAllOrders();
  const row = list.find((o) => o.id === orderId);
  if (!row) {
    throw new Error("Order not found");
  }
  const payload = toOrderUpdatePayload({
    ...row,
    payment_made: true,
    payment_date: new Date().toISOString().split("T")[0],
  });
  await putOrderUpdateHttp(payload, row.customers.name);
  await queryClient.invalidateQueries({ queryKey: customerKeys.all });
};

export const updateOrder = async (order: OrderUpdatePayload) => {
  const list = await getAllOrders();
  const row = list.find((o) => o.id === order.id);
  const name = row?.customers.name ?? "Unknown";
  const updated = await putOrderUpdateHttp(order, name);
  await queryClient.invalidateQueries({ queryKey: customerKeys.all });
  return updated;
};
