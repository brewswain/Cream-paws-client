import { Dispatch, SetStateAction } from "react";
import { OrderFromSupabase, OrderPayload } from "../models/order";
import { create, StateCreator } from "zustand";
import { supabase } from "../utils/supabase";
import { createOrder, getAllOrders } from "../api";
import { getCustomersOrders } from "../api/routes/orders";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UseOrderStore = {
  orders: OrderFromSupabase[];
  customerOrders: OrderFromSupabase[];
  outstandingOrders: OrderFromSupabase[];
  completedOrders: OrderFromSupabase[];

  isFetching: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchCustomerOrders: (customerId: number) => Promise<void>;
  createOrder: (orderPayload: OrderPayload) => Promise<void>;
  // deleteOrder: (orderId: string) => Promise<void>;
  // updateOrder: (orderId: string, orderPayload: OrderPayload) => Promise<void>;
  selectedOrderIds: number[];
  setSelectedOrderIds: (orderId: number) => void;
  setOutstandingOrders: (orders: OrderFromSupabase[]) => void;
  setCompletedOrders: (orders: OrderFromSupabase[]) => void;
};

type OrderPersist = (
  config: StateCreator<UseOrderStore>,
  options: PersistOptions<UseOrderStore>
) => StateCreator<UseOrderStore>;

const useOrderStore = create<UseOrderStore>(
  (persist as OrderPersist)(
    (set, get) => ({
      orders: [],
      customerOrders: [],
      outstandingOrders: [],
      completedOrders: [],
      isFetching: false,
      error: null,
      selectedOrderIds: [],
      setSelectedOrderIds: (orderId: number) => {
        set((state) => ({
          ...state,
          selectedOrderIds: state.selectedOrderIds.includes(orderId)
            ? state.selectedOrderIds.filter((id) => id !== orderId)
            : [...(state.selectedOrderIds || []), orderId],
        }));
      },
      setCompletedOrders: (orders: OrderFromSupabase[]) => {
        set({ completedOrders: orders });
      },
      setOutstandingOrders: (orders: OrderFromSupabase[]) => {
        set({ outstandingOrders: orders });
      },
      fetchOrders: async () => {
        set({ isFetching: true });
        try {
          const data = await getAllOrders();

          const outstandingOrders = data.filter(
            (order) => order.payment_made === false
          );

          const completedOrders = data.filter(
            (order) => order.payment_made === true
          );

          data &&
            set({
              orders: data,
              outstandingOrders: outstandingOrders,
              completedOrders: completedOrders,
              isFetching: false,
              error: null,
            });
        } catch (error) {
          set({ isFetching: false, error: `Failed to fetch orders: ${error}` });
          console.error(error);
        }
      },
      fetchCustomerOrders: async (customerId: number) => {
        try {
          const data = await getCustomersOrders(customerId);
          set({ customerOrders: data, isFetching: false, error: null });
        } catch (error) {
          set({
            isFetching: false,
            error: `Failed to fetch customer's orders: ${error}`,
          });
          console.error(error);
        }
      },
      createOrder: async (orderPayload: OrderPayload) => {
        try {
          await createOrder(orderPayload);
        } catch (error) {
          set({ error: `Failed to create order: ${error} ` });
          console.error(error);
        }
      },
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { useOrderStore };
