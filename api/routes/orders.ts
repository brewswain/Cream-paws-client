import { axiosInstance } from "../api";

export const createOrder = async (order: Order) => {
   const {
      delivery_date,
      payment_made,
      payment_date,
      is_delivery,
      driver_paid,
      warehouse_paid,
      customer_id,
      chow_id,
   } = order;

   try {
      const response = await axiosInstance.post("/orders", {
         delivery_date,
         payment_made,
         payment_date,
         is_delivery,
         driver_paid,
         warehouse_paid,
         customer_id,
         chow_id,
      });
      return response.data;
   } catch (error) {
      alert(error);
   }
};
