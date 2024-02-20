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
    // | OrderWithChowDetails[]
    // | {
    //     order_id: string;
    //     customer_id: string;
    //   }[]
     OrderWithChowDetails[]
) => {
  try {
    await Promise.all(
      orders.map(async (order) => {
        const updatedOrder = {
          ...order,
          payment_made: true
        }
        // await deleteCustomersOrder(order.order_id!, order.customer_id);
        await updateOrder(updatedOrder);
      })
    );

    return;
  } catch (error) {
    console.error(error);
  }
};

export const clearCourierFees = async(orders: OrderWithChowDetails[]) => {
  console.log("clearCourierFees called: ", orders)
  try {
    await Promise.all(
      orders.map(async (order) => {
        const updatedOrder = {
          ...order,
          driver_paid: true,
        }
        await updateOrder(updatedOrder) 
      })
    )
  } catch (error) {
    console.error(error)
  }
}

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
  const combinedOrders: Record<string, any[]> = {};

  for (const order of orders) {
    const customer = await findCustomer(order.customer_id);

    const {
      delivery_date,
      delivery_cost,
      driver_paid,
      quantity,
      chow_id,
      customer_id,
      ...restOrderDetails
    } = order;

    const orderKey = `${customer.name}-${delivery_date}`;

    if (!combinedOrders[orderKey]) {
      combinedOrders[orderKey] = {
        name: customer.name,
        delivery_date,
        delivery_cost,
        driver_paid,
        customer_id,
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
        delivery_date,
        delivery_cost,
        driver_paid,
        ...restOrderDetails,
      });
    }
  }

  return Object.values(combinedOrders);
};

export const concatFinanceQuantities = async (
  orders: OrderWithChowDetails[]
) => {
  const updatedOrders = {};
  for (const order of orders) {
    const existingOrder = updatedOrders[order.chow_id];

    if (existingOrder) {
      // Update quantity for the existing order
      existingOrder.quantity += order.quantity;
    } else {
      // Add a new order if chow_id is not present
      updatedOrders[order.chow_id] = { ...order };
    }
  }

  return Object.values(updatedOrders);
};
