import axios from "axios";

export const createCustomer = async (name: string) => {
   try {
      const response = await axios.post(`http://ticketing.dev/api/customer`, {
         name,
      });
      return response.data;
   } catch (error) {
      alert(error);
   }
};

export const deleteCustomer = async (id: string) => {
   try {
      await axios.delete(`http://ticketing.dev/api/customer/${id}`);
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
      const response = await axios.get("http://ticketing.dev/api/customer");
      return response.data;
   } catch (error) {
      console.error(error);
   }
};

export const updateCustomer = async (id: string, name: string) => {
   try {
      await axios.put(`http://ticketing.dev/api/customer/${id}`, { name });
   } catch (error) {
      alert(error);
   }
};
