import axios from "axios";
import { axiosInstance } from "../api";

// Creating default param in case we don't have any pets added
export const createCustomer = async (name: string, pets: any[] = []) => {
   try {
      const response = await axiosInstance.post(`/customer`, {
         name,
         pets,
      });
      return response.data;
   } catch (error) {
      alert(error);
   }
};

export const deleteCustomer = async (id: string) => {
   try {
      await axiosInstance.delete(`/customer/${id}`);
   } catch (error) {
      // TODO: use toasts instead of alerts
      alert(error);
   }
};

// TODO: decide if we need this in frontend, prob use a search bar style approach instead
// export const findCustomer = async () => {
//    axios.post(`${baseUrl}/customer`);
// };

export const getAllCustomers = async () => {
   try {
      const response = await axiosInstance.get("/customer");
      console.log(response.data);
      return response.data;
   } catch (error) {
      console.error(error);
   }
};

export const updateCustomer = async (id: string, name: string) => {
   try {
      await axiosInstance.put(`/customer/${id}`, { name });
   } catch (error) {
      alert(error);
   }
};
