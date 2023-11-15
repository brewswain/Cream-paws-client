import { axiosInstance } from "../api";

export const createOrder = async (order: firstTimeOrder) => {
  const {
    delivery_date,
    payment_made,
    payment_date,
    is_delivery,
    driver_paid,
    quantity,
    warehouse_paid,
    customer_id,
    chow_id,
  } = order;

  try {
    const response = await axiosInstance.post("/orders", {
      delivery_date,
      payment_made,
      payment_date,
      is_delivery,
      driver_paid,
      quantity,
      warehouse_paid,
      customer_id,
      chow_id,
    });
    return response.data;
  } catch (error) {
    alert(error);
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
export const updateOrder = async (order: Order) => {
  try {
    const response = await axiosInstance.put(
      `/orders/${order.order_id}`,
      order
    );

    console.log({ response: response.data });
    return response.data;
  } catch (error) {
    console.error({ error });
  }
};
