import { OwnerStats } from "@/app/common/types/stats";
import { getOwnerStats } from "@/frontendlib/services/statsService";
import { create } from "zustand";

type Stats = {
  adminStats: string;
  ownerStats: OwnerStats | null;
  getOwnerStats: () => Promise<void>;
};

export const useStatsStore = create<Stats>((set) => ({
  ownerStats: null,
  adminStats: "",
  getOwnerStats: async () => {
    const stats = await getOwnerStats();
    set({ ownerStats: stats });
  },
}));
