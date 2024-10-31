import { create, StateCreator } from "zustand";
import { Customer, CustomerPayload } from "../models/customer";
import { supabase } from "../utils/supabase";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFinanceScreenOrders } from "../api/routes/orders";
import { OrderFromSupabase } from "../models/order";

type UseFinanceStore = {
  isFetching: boolean;
  error: string | null;
  fetchFinanceData: () => void;
  warehouseOrders: OrderFromSupabase[];
  courierOrders: OrderFromSupabase[];
};

type FinancePersist = (
  config: StateCreator<UseFinanceStore>,
  options: PersistOptions<UseFinanceStore>
) => StateCreator<UseFinanceStore>;

const useFinanceStore = create<UseFinanceStore>(
  (persist as FinancePersist)(
    (set, get) => ({
      isFetching: false,
      error: null,
      warehouseOrders: [],
      courierOrders: [],
      fetchFinanceData: async () => {
        set({ isFetching: true });
        const { unpaidWarehouseOrders, unpaidCourierFees } =
          await getFinanceScreenOrders();

        set({
          warehouseOrders: unpaidWarehouseOrders,
          courierOrders: unpaidCourierFees,
          isFetching: false,
          error: null,
        });
      },
    }),
    {
      name: "finance-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { useFinanceStore };
