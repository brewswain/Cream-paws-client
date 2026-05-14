import { axiosInstance } from "../../api/http";
import { customerListResponseSchema } from "../../schemas/customerList";
import { orderListResponseSchema } from "../../schemas/orderApi";
import { mergeOrdersIntoCustomers } from "./mergeOrdersIntoCustomers";

export async function fetchCustomersWithOrders() {
  const [customersRes, ordersRes] = await Promise.all([
    axiosInstance.get<unknown[]>("/api/customer"),
    axiosInstance.get<unknown[]>("/api/orders"),
  ]);

  const customers = customerListResponseSchema.parse(customersRes.data);
  const orders = orderListResponseSchema.parse(ordersRes.data);
  return mergeOrdersIntoCustomers(customers, orders);
}
