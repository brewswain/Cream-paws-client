import { OrderWithChowDetails } from "../../models/order";
import { axiosInstance } from "../api";

export const createOrder = async (order: firstTimeOrder) => {
  const {
    delivery_date,
    payment_made,
    delivery_cost,
    payment_date,
    is_delivery,
    driver_paid,
    quantity,
    warehouse_paid,
    customer_id,
    flavour_name,
    chow_id,
  } = order;

  try {
    const response = await axiosInstance.post("/orders", order);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteOrder = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteCustomersOrder = async (
  orderId: string,
  customerId: string
) => {
  try {
    const response = await axiosInstance.delete("/orders/customer", {
      data: { customerId, orderId },
    });
    return response.data;
  } catch (error) {}
};

export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// TODO: fix typings lol
export const updateOrder = async (order: OrderWithChowDetails) => {
  try {
    const response = await axiosInstance.put(
      `/orders/${order.order_id}`,
      order
    );

    return response.data;
  } catch (error) {
    console.error({ error });
  }
};

export const payWarehouseOrders = async (orders: OrderWithChowDetails[]) => {};
