import {
  OrderFromSupabase,
  OrdersByCustomer,
  TodaysOrder,
} from "../models/order";
import { create, StateCreator } from "zustand";

import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTodaysOrders } from "../api/routes/orders";

type UseTodaysOrdersStore = {
  todaysOrders: OrdersByCustomer;
  outstandingOrders: TodaysOrder[];
  completedOrders: TodaysOrder[];
  isFetching: boolean;
  error: string | null;
  fetchTodaysOrders: () => Promise<void>;
  customersCollapsed: boolean;
  toggleCustomersCollapsed: () => void;
  ordersCollapsed: boolean;
  toggleOrdersCollapsed: () => void;
};

type TodaysOrdersPersist = (
  config: StateCreator<UseTodaysOrdersStore>,
  options: PersistOptions<UseTodaysOrdersStore>
) => StateCreator<UseTodaysOrdersStore>;

const useTodaysOrdersStore = create<UseTodaysOrdersStore>(
  (persist as TodaysOrdersPersist)(
    (set, get) => ({
      todaysOrders: {},
      outstandingOrders: [],
      completedOrders: [],
      customersCollapsed: true,
      ordersCollapsed: true,
      isFetching: false,
      error: null,
      fetchTodaysOrders: async () => {
        set({ isFetching: true });
        try {
          const data = await getTodaysOrders();
          let outstandingOrdersData: TodaysOrder[] = [];
          let completedOrdersData: TodaysOrder[] = [];
          for (const customerName in data) {
            const customerOrders = data[customerName];

            outstandingOrdersData = customerOrders.filter(
              (order) => order.payment_made === false
            );
            completedOrdersData = customerOrders.filter(
              (order) => order.payment_made === true
            );
          }

          set({
            isFetching: false,
            todaysOrders: data,
            outstandingOrders: outstandingOrdersData,
            completedOrders: completedOrdersData,
            error: null,
          });
        } catch (error) {
          set({
            isFetching: false,
            error: `Failed getting today's orders: ${error}`,
          });
          console.error(error);
        }
      },
      toggleCustomersCollapsed: () => {
        set({ customersCollapsed: !get().customersCollapsed });
      },
      toggleOrdersCollapsed: () => {
        set({ ordersCollapsed: !get().ordersCollapsed });
      },
    }),
    {
      name: "todays-orders-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { useTodaysOrdersStore };
