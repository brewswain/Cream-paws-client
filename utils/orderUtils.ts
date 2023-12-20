import moment from "moment";

import { findCustomer, getAllCustomers, updateOrder } from "../api";
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
export const clearCustomerOrders = async (
  orders:
    | OrderWithChowDetails[]
    | {
        order_id: string;
        customer_id: string;
      }[]
) => {
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

export const combineOrders = async (orders: OrderWithChowDetails[]) => {
  const combinedOrders = {};

  for (const order of orders) {
    const customerName = await findCustomer(order.customer_id);
    const {
      delivery_date,
      delivery_cost,
      quantity,
      chow_id,
      customer_id,
      ...restOrderDetails
    } = order;

    const orderKey = `${delivery_date}_${delivery_cost}`;

    if (!combinedOrders[orderKey]) {
      combinedOrders[orderKey] = {
        delivery_date,
        delivery_cost,
        customer_id,
        name: customerName.name,
        orders: [],
      };
    }

    const existingOrderIndex = combinedOrders[orderKey].orders.findIndex(
      (existingOrder) => existingOrder.chow_id === chow_id
    );

    if (existingOrderIndex !== -1) {
      // Update quantity if the same chow_id is detected
      combinedOrders[orderKey].orders[existingOrderIndex].quantity += quantity;
    } else {
      // Add a new order if chow_id is not present
      combinedOrders[orderKey].orders.push({
        chow_id,
        quantity,
        ...restOrderDetails,
      });
    }
  }

  return Object.values(combinedOrders);
};
