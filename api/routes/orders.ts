import {
  OrderFromSupabase,
  OrderFromSupabasePayload,
  OrderPayload,
  OrdersByCustomer,
  OrderWithChowDetails,
} from "../../models/order";
import { supabase } from "../../utils/supabase";
import { axiosInstance } from "../api";
import { logNewSupabaseError } from "../error";

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
    logNewSupabaseError(
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
    logNewSupabaseError(
      "Error retrieving intermediary Id: ",
      chowIntermediaryError
    );
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
    retail_price: orderPayload.retail_price
      ? orderPayload.retail_price
      : varietyRetailPriceData[0].retail_price,
  });

  if (error) {
    logNewSupabaseError("Error creating new order: ", error);
    throw new Error(error.message);
  }

  console.log("Order created successfully");
};

export const deleteOrder = async (id: number) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    logNewSupabaseError("Error deleting order: ", error);
    throw new Error(error.message);
  }

  console.log("Successfully deleted Order");
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
    .returns<OrderFromSupabase[]>()

    .order("customers (name)");

  if (error) {
    logNewSupabaseError("Error retrieving all Orders: ", error);
    throw new Error(error.message);
  }

  return data;
};

export const getTodaysOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
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
customers (*)
`
    )
    .eq("delivery_date", new Date().toISOString().split("T")[0])
    .returns<OrderFromSupabase[]>();

  if (error) {
    logNewSupabaseError("Error retrieving today's orders: ", error);
    throw new Error(error.message);
  }

  // separate our orders by unique customer
  const ordersByCustomer: OrdersByCustomer = data.reduce(
    (acc: { [key: string]: any }, order) => {
      const customerName = order.customers.name;
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

export const getCustomersOrders = async (customerId: number) => {
  const { data, error } = await supabase
    .from("orders")
    .select(orderQuery)
    .eq("customer_id", customerId)
    .returns<OrderFromSupabase[]>()
    .order("customers (name)");

  if (error) {
    logNewSupabaseError("Error retrieving customer's orders: ", error);
    throw new Error(error.message);
  }

  return data;
};

export const setPaymentMade = async (orderId: number) => {
  const { error } = await supabase
    .from("orders")
    .update({ payment_made: true })
    .eq("id", orderId)
    .select("payment_made")
    .single();

  if (error) {
    logNewSupabaseError("Error updating payment_made: ", error);
    throw new Error(error.message);
  }
};

export const updateOrder = async (order: OrderFromSupabasePayload) => {
  const { data: intermediaryId, error: intermediaryError } = await supabase
    .from("chow_intermediary")
    .upsert(
      {
        brand_id: order.flavours.brand_details.id,
        flavour_id: order.flavours.details?.flavour_id,
        variety_id: order.variety?.id,
      },
      {
        ignoreDuplicates: false,
        onConflict: "brand_id, flavour_id, variety_id",
      }
    )
    .select("id")
    .single();

  if (intermediaryError) {
    logNewSupabaseError("Error upserting intermediary ID: ", intermediaryError);
    throw new Error(intermediaryError.message);
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      customer_id: order.customer_id,
      chow_intermediary_ids: intermediaryId.id,
      delivery_date: order.delivery_date,
      delivery_cost: order.delivery_cost,
      retail_price: order.retail_price,
      wholesale_price: order.wholesale_price,
      quantity: order.quantity,
      variety_id: order.variety?.id,
      payment_made: order.payment_made,
    })
    .eq("id", order.id)
    .single();

  if (error) {
    logNewSupabaseError("Error updating customer's orders: ", error);
    throw new Error(error.message);
  }

  return data;
};

export const payWarehouseOrders = async (orders: OrderWithChowDetails[]) => {};
