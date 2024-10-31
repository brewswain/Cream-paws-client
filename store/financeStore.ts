import { create, StateCreator } from "zustand";
import { Customer, CustomerPayload } from "../models/customer";
import { supabase } from "../utils/supabase";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UseFinanceStore = {
  isFetching: boolean;
  error: string | null;
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
    }),
    {
      name: "finance-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { useFinanceStore };
