import { updateOrder } from "../api";

export const clearAllOrders = (orders) => {
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
            version: order.version + 1,
            quantity: order.quantity,
            id: order.id,
         };
         await updateOrder(updatedOrder);
      });

      return;
   } catch (error) {
      console.error(error);
   }
};
