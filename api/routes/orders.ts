import {
  OrderFromSupabase,
  OrderPayload,
  OrderWithChowDetails,
} from "../../models/order";
import { supabase } from "../../utils/supabase";
import { axiosInstance } from "../api";

const orderQuery = `
id,
is_delivery,
delivery_date,
delivery_cost,
payment_made,
payment_date,
retail_price,
wholesale_price,
quantity,
variety_id,
driver_paid,
warehouse_paid,
customer_id,
flavours:chow_intermediary (brand_details:brands(name:brand_name, id),details:chows(flavour_id:id, flavour_name)),
variety:chow_varieties(*),
customers (name)
`;
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
    variety_id: orderPayload.variety_id,
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

// flavours:chow_intermediary (brand_details:brands(name:brand_name, id),details:chows(flavour_id:id, flavour_name, varieties:chow_varieties(id, size, unit, wholesale_price, retail_price, chow_id))),

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(orderQuery)
    // .filter("chow_intermediary.chows.varieties.id", "eq", "variety_id")
    .returns<OrderFromSupabase[]>()

    .order("customers (name)");

  if (error) {
    console.error("Error retrieving all Orders: ", error);
    throw new Error(error.message);
  }

  return data;
};

export const getCustomersOrders = async (customerId: number) => {
  const { data, error } = await supabase
    .from("orders")
    .select(orderQuery)
    .eq("customer_id", customerId)
    .returns<OrderFromSupabase[]>()
    .order("customers (name)");

  if (error) {
    console.error("Error retrieving customer's orders: ", error);
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
