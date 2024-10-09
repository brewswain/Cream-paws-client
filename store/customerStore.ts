import axios from "axios";
import { create } from "zustand";
import { Customer, CustomerPayload } from "../models/customer";
import { supabase } from "../utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UseCustomerStore = {
  customers: Customer[];
  isFetching: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (customerPayload: CustomerPayload) => Promise<void>;
};
const useCustomerStore = create<UseCustomerStore>((set) => ({
  customers: [],
  isFetching: false,
  error: null,

  fetchCustomers: async () => {
    set({ isFetching: true });
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .returns<Customer[]>()
      .order("name");

    if (error) {
      set({ isFetching: false, error: error.message });
    }

    data && set({ customers: data, isFetching: false, error: null });
    await AsyncStorage.setItem("customers", JSON.stringify(data));
  },

  // Customise this after
  addCustomer: async (newCustomer: CustomerPayload) => {
    try {
      const response = await axios.post("/customer", newCustomer);
      set((state: any) => ({ customers: [...state.customers, response.data] }));
    } catch (error) {
      console.error(error);
    }
  },
}));

export { useCustomerStore };
