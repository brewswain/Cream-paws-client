import { getParsedCommandLineOfConfigFile } from "typescript";
import { axiosInstance } from "../api";

export const createChow = async (chow: Chow) => {
   //    const {
   //       brand,
   //       target_group,
   //       flavour,
   //       size,
   //       unit,
   //       quantity,
   //       wholesale_price,
   //       retail_price,
   //       is_paid_for,
   //    } = chow;

   try {
      const response = await axiosInstance.post("/stock", chow);

      return response.data;
   } catch (error) {
      alert(error);
   }
};

export const deleteChow = async (id: string) => {
   try {
      const response = await axiosInstance.delete(`/stock/${id}`);

      return response.data;
   } catch (error) {
      alert(error);
   }
};

export const updateChow = async (id: string, chow: Chow) => {
   try {
      const response = await axiosInstance.put(`/stock/${id}`, chow);

      return response.data;
   } catch (error) {
      alert(error);
   }
};

export const getAllChow = async () => {
   try {
      const response = await axiosInstance.get("/stock");

      return response.data;
   } catch (error) {
      alert(error);
   }
};
