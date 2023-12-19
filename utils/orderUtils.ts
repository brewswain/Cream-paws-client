import moment from "moment";

import { getAllCustomers, updateOrder } from "../api";
import { OrderWithChowDetails } from "../models/order";
import { Customer } from "../models/customer";
import { deleteCustomersOrder } from "../api/routes/orders";

export const clearOrders = async (orders: OrderWithChowDetails[]) => {
  try {
    await Promise.all(
      orders.map(async (order) => {
        const updatedOrder = {
          ...order,
          payment_made: true,
        };

        await updateOrder(updatedOrder);
      })
    );
    return;
  } catch (error) {
    console.error(error);
  }
};

export const clearCustomerOrders = async (orders: OrderWithChowDetails[]) => {
  try {
    await Promise.all(
      orders.map(async (order) => {
        await deleteCustomersOrder(order.order_id!, order.customer_id);
      })
    );
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
