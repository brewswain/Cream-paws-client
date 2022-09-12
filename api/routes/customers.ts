import axios from "axios";
import { baseUrl } from "../api";

export const createCustomer = async (pets = []) => {
   try {
      axios.post(`${baseUrl}/customer`, { body: { pets } });
   } catch (error) {
      alert(error);
   }
};

export const deleteCustomer = async (id: string) => {
   try {
      axios.delete(`${baseUrl}/customer/:${id}`);
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
   axios.get(`${baseUrl}/customer`);
};

export const updateCustomer = async (id: string) => {
   try {
      axios.put(`${baseUrl}/customer/:${id}`);
   } catch (error) {
      alert(error);
   }
};
