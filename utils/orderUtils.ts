import moment from "moment";

import { findCustomer, getAllCustomers, updateOrder } from "../api";
import { OrderFromSupabase, OrderWithChowDetails } from "../models/order";
import { Customer } from "../models/customer";
import {
  deleteCustomersOrder,
  getAllOrders,
  setPaymentMade,
} from "../api/routes/orders";

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

export const clearCustomerOrders = async (order_ids: number[]) => {
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

export const clearCourierFees = async (orders: OrderWithChowDetails[]) => {
  try {
    await Promise.all(
      orders.map(async (order) => {
        const updatedOrder = {
          ...order,
          driver_paid: true,
        };

        await updateOrder(updatedOrder);
      })
    );
  } catch (error) {
    console.error(error);
  }
};

export const getTodaysOrders = async () => {
  // export const getTodaysOrders = async (getCompletedOrders: boolean) => {
  const customerResponse: Customer[] = await getAllCustomers();

  const filteredOutstandingOrders = customerResponse
    .flatMap(
      (customer) =>
        customer.orders?.filter((order: OrderWithChowDetails) => {
          const parsedPaymentDate = moment(order.delivery_date).format(
            "YYYY-MM-DD"
          );
          const today = moment().format("YYYY-MM-DD");

          return parsedPaymentDate === today;
        }) ?? []
    )
    .filter((order) => order !== undefined);

  return filteredOutstandingOrders;
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

export const concatFinanceQuantities = async (orders: OrderFromSupabase[]) => {
  // const updatedOrders = {};
  // for (const order of orders) {
  //   const existingOrder = updatedOrders[order.chow_id];

  //   if (existingOrder) {
  //     // Update quantity for the existing order
  //     existingOrder.quantity += order.quantity;
  //   } else {
  //     // Add a new order if chow_id is not present
  //     updatedOrders[order.chow_id] = { ...order };
  //   }
  // }

  // return Object.values(updatedOrders);
  const itemizedBill = orders.reduce(
    (accumulator: OrderFromSupabase[] | [], currentOrder) => {
      const varietyId = currentOrder.variety.id;
      const existingOrderIndex = accumulator.findIndex(
        (order) => order.variety.id === varietyId
      );

      if (existingOrderIndex !== -1) {
        // Update quantity of existing order
        accumulator[existingOrderIndex].quantity += currentOrder.quantity;
      } else {
        // Add new order to array
        return [
          ...accumulator,
          { ...currentOrder, quantity: currentOrder.quantity },
        ];
      }

      return accumulator;
    },
    []
  );
  return itemizedBill;
};
