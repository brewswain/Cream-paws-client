import moment from "moment";

import { getAllCustomers, updateOrder } from "../api";

export const clearOrders = (orders: Order[]) => {
  try {
    orders.map(async (order) => {
      const updatedOrder = {
        delivery_date: order.delivery_date,
        payment_date: order.payment_date,
        payment_made: true,
        is_delivery: order.is_delivery,
        driver_paid: order.driver_paid,
        warehouse_paid: order.warehouse_paid,
        customer_id: order.customer_id,
        chow_id: order.chow_id,
        version: order.version,
        quantity: order.quantity,
        id: order._id,
        _id: order._id,
      };

      await updateOrder(updatedOrder);
    });

    return;
  } catch (error) {
    console.error(error);
  }
};

export const getTodaysOrders = async () => {
  const customerResponse: Customer[] = await getAllCustomers();

  const filteredOutstandingOrders = customerResponse.map((customer) => {
    return customer.orders?.filter(
      (order: OrderWithChowDetails) => order.payment_made === false
      //  && order.payment_date === moment()
    );
  });

  return filteredOutstandingOrders.flat();
};
