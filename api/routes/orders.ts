import { OrderWithChowDetails } from "../../models/order";
import { supabase } from "../../utils/supabase";
import { axiosInstance } from "../api";

export const createOrder = async (order: OrderWithChowDetails) => {
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

// export const getAllOrders = async () => {
//   try {
//     const response = await axiosInstance.get("/orders");
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// };

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .returns<OrderWithChowDetails[]>()
    .order("name");

  if (error) {
    throw new Error(error.message);
  }
  return data;
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
