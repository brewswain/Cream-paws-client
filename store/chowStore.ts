import { create, StateCreator } from "zustand";
import {
  ChowFlavourFromSupabase,
  ChowFlavourFromSupabasePayload,
  ChowFromSupabase,
  ChowFromSupabasePayload,
} from "../models/chow";
import { supabase } from "../utils/supabase";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllChow } from "../api";
type UseChowStore = {
  chows: ChowFromSupabase[];
  isFetching: boolean;
  error: string | null;
  fetchChows: () => Promise<void>;
  createChow: (chowPayload: ChowFromSupabasePayload) => Promise<void>;
  deleteChow: (brand_id: number) => Promise<void>;
  updateChow: (chowPayload: ChowFromSupabasePayload) => Promise<void>;
  updateChowFlavour: (
    chowFlavour: ChowFlavourFromSupabasePayload
  ) => Promise<void>;
};

type ChowPersist = (
  config: StateCreator<UseChowStore>,
  options: PersistOptions<UseChowStore>
) => StateCreator<UseChowStore>;

const useChowStore = create<UseChowStore>(
  (persist as ChowPersist)(
    (set, get) => ({
      chows: [],
      isFetching: false,
      error: null,
      fetchChows: async () => {
        set({ isFetching: true });

        const response = await getAllChow();
        set({ chows: response, isFetching: false, error: null });
      },
      // Leave these in for optimistic updates
      createChow: async () => {},
      deleteChow: async () => {},
      updateChow: async () => {},
      updateChowFlavour: async () => {},
    }),
    {
      name: "chow-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { useChowStore };
