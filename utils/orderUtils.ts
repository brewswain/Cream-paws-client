import moment from "moment";

import { updateOrder } from "../api";
import {
  OrderFromSupabase,
  toOrderUpdatePayload,
} from "../models/order";
import { Customer } from "../models/customer";
import {
  deleteCustomersOrder,
  getAllOrders,
  setPaymentMade,
} from "../api/routes/orders";

export const clearWarehouseOrders = async (orders: OrderFromSupabase[]) => {
  try {
    await Promise.all(
      orders.map(async (order) => {
        const updatedOrder = toOrderUpdatePayload({
          ...order,
          warehouse_paid: true,
        });
        await updateOrder(updatedOrder);
      })
    );
    return;
  } catch (error) {
    console.error(error);
  }
};

export const clearCustomerOrders = async (order_ids: string[]) => {
  try {
    await Promise.all(
      order_ids.map(async (id) => {
        await setPaymentMade(id);
      })
    );

    return;
  } catch (error) {
    console.error(error);
  }
};

export const clearCourierFees = async (orders: OrderFromSupabase[]) => {
  try {
    await Promise.all(
      orders.map(async (order) => {
        const updatedOrder = toOrderUpdatePayload({
          ...order,
          driver_paid: true,
        });
        await updateOrder(updatedOrder);
      })
    );
  } catch (error) {
    console.error(error);
  }
};

export const getUnpaidCustomerOrders = async () => {
  const orders = await getAllOrders();

  const filteredOutstandingOrders = orders.filter(
    (order) => order.payment_made === false
  );

  return filteredOutstandingOrders;
};

export const getUnpaidCourierFees = async () => {
  const response: OrderFromSupabase[] = await getAllOrders();

  const filteredUnpaidCourierFees =
    response.filter((order) => order.driver_paid === false) ??
    [].filter((order) => order !== undefined);

  return filteredUnpaidCourierFees;
};

export const getUnpaidWarehouseOrders = async () => {
  const orderResponse: OrderFromSupabase[] = await getAllOrders();

  const filteredOutstandingOrders =
    orderResponse.filter((order) => order.warehouse_paid === false) ??
    [].filter((order) => order !== undefined);

  return filteredOutstandingOrders;
};

export const concatFinanceQuantities = async (orders: OrderFromSupabase[]) =>
  orders.map((o) => ({ ...o }));
