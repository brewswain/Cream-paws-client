import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

/** Finance UI state only; order rows come from TanStack Query (`customerKeys.listWithOrders`). */
type UseFinanceStore = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  targetIds: string[];
  setTargetIds: (ids: string[]) => void;
};

type FinancePersist = (
  config: StateCreator<UseFinanceStore>,
  options: PersistOptions<UseFinanceStore>
) => StateCreator<UseFinanceStore>;

const useFinanceStore = create<UseFinanceStore>(
  (persist as FinancePersist)(
    (set) => ({
      showModal: false,
      setShowModal: (show: boolean) => set({ showModal: show }),
      targetIds: [],
      setTargetIds: (ids: string[]) => set({ targetIds: ids }),
    }),
    {
      name: "finance-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { useFinanceStore };
