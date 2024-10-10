import { OrderPayload, OrderWithChowDetails } from "../../models/order";
import { supabase } from "../../utils/supabase";
import { axiosInstance } from "../api";

export const createOrder = async (orderPayload: OrderPayload) => {
  const { data: varietyRetailPriceData, error: varietyRetailPriceError } =
    await supabase
      .from("chow_varieties")
      .select("retail_price")
      .eq("id", orderPayload.variety_id);

  if (varietyRetailPriceError) {
    console.error(
      "Error retrieving intermediary Id: ",
      varietyRetailPriceError
    );
    throw new Error(varietyRetailPriceError.message);
  }
  const { data: chowIntermediaryData, error: chowIntermediaryError } =
    await supabase
      .from("chow_intermediary")
      .select("id")
      .eq("brand_id", orderPayload.brand_id)
      .eq("flavour_id", orderPayload.flavour_id)
      .eq("variety_id", orderPayload.variety_id);

  if (chowIntermediaryError) {
    console.error("Error retrieving intermediary Id: ", chowIntermediaryError);
    throw new Error(chowIntermediaryError.message);
  }

  const { error } = await supabase.from("orders").insert({
    chow_intermediary_ids: chowIntermediaryData[0].id,
    quantity: orderPayload.quantity,
    customer_id: orderPayload.customer_id,
    delivery_date: orderPayload.delivery_date,
    delivery_cost: orderPayload.delivery_cost,
    payment_date: orderPayload.payment_date,
    payment_made: orderPayload.payment_made,
    is_delivery: orderPayload.is_delivery,
    driver_paid: orderPayload.driver_paid,
    warehouse_paid: orderPayload.warehouse_paid,

    retail_price: varietyRetailPriceData[0].retail_price,
  });

  if (error) {
    console.error("Error creating new order: ", error);
    throw new Error(error.message);
  }

  console.log("Order created successfully");
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
