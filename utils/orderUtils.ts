import moment from "moment";

import { getAllCustomers, updateOrder } from "../api";
import { OrderWithChowDetails } from "../models/order";
import { Customer } from "../models/customer";
import { deleteCustomersOrder, getAllOrders } from "../api/routes/orders";

export const clearWarehouseOrders = async (orders: OrderWithChowDetails[]) => {
  try {
    await Promise.all(
      orders.map(async (order) => {
        const updatedOrder = {
          ...order,
          warehouse_paid: true,
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

    return;
  } catch (error) {
    console.error(error);
  }
};

export const getTodaysOrders = async () => {
  const customerResponse: Customer[] = await getAllCustomers();

  const filteredOutstandingOrders = customerResponse
    .flatMap(
      (customer) =>
        customer.orders?.filter((order: OrderWithChowDetails) => {
          const parsedPaymentDate = moment(order.delivery_date).format(
            "YYYY-MM-DD"
          );
          const today = moment().format("YYYY-MM-DD");
          return order.payment_made === false && parsedPaymentDate === today;
        }) ?? []
    )
    .filter((order) => order !== undefined);

  return filteredOutstandingOrders;
};

export const getUnpaidCustomerOrders = async () => {
  const customerResponse: Customer[] = await getAllCustomers();

  const filteredOutstandingOrders = customerResponse
    .flatMap(
      (customer) =>
        customer.orders?.filter(
          (order: OrderWithChowDetails) => order.payment_made === false
        ) ?? []
    )
    .filter((order) => order !== undefined);

  return filteredOutstandingOrders;
};

export const getUnpaidWarehouseOrders = async () => {
  const orderResponse: OrderWithChowDetails[] = await getAllOrders();

  const filteredOutstandingOrders =
    orderResponse.filter((order) => order.warehouse_paid === false) ??
    [].filter((order) => order !== undefined);

  return filteredOutstandingOrders;
};
