import axios from "axios";
import { create, StateCreator } from "zustand";
import { Customer, CustomerPayload } from "../models/customer";
import { supabase } from "../utils/supabase";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
type UseCustomerStore = {
  customers: Customer[];
  isFetching: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (customerPayload: CustomerPayload) => Promise<void>;
};

type CustomerPersist = (
  config: StateCreator<UseCustomerStore>,
  options: PersistOptions<UseCustomerStore>
) => StateCreator<UseCustomerStore>;
const useCustomerStore = create<UseCustomerStore>(
  (persist as CustomerPersist)(
    (set, get) => ({
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
      },

      // Customise this after
      addCustomer: async (newCustomer: CustomerPayload) => {
        try {
          const response = await axios.post("/customer", newCustomer);
          set((state: any) => ({
            customers: [...state.customers, response.data],
          }));
        } catch (error) {
          console.error(error);
        }
      },
    }),
    {
      name: "customer-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { useCustomerStore };
