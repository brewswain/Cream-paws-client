import { axiosInstance } from "../api";

export const createOrder = async (order: Order) => {
   const {
      delivery_date,
      payment_made,
      payment_date,
      is_delivery,
      driver_paid,
      quantity,
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
         quantity,
         warehouse_paid,
         customer_id,
         chow_id,
      });
      return response.data;
   } catch (error) {
      alert(error);
   }
};

export const deleteOrder = async (id: string) => {
   try {
      const response = await axiosInstance.delete(`/orders/${id}`);
      return response.data;
   } catch (error) {
      alert(error);
   }
};

export const getAllOrders = async () => {
   try {
      const response = await axiosInstance.get("/orders");
      return response.data;
   } catch (error) {
      console.error(error);
   }
};

// TODO: fix typings lol
export const updateOrder = async (id: string, order: Order) => {
   try {
      const {
         delivery_date,
         payment_made,
         payment_date,
         is_delivery,
         driver_paid,
         quantity,
         warehouse_paid,
         customer_id,
         chow_id,
      } = order;
      const response = await axiosInstance.put(`/orders/${id}`, {
         delivery_date,
         payment_made,
         payment_date,
         quantity,
         is_delivery,
         driver_paid,
         warehouse_paid,
         customer_id,
         chow_id,
      });

      return response.data;
   } catch (error) {
      console.error(error);
   }
};
