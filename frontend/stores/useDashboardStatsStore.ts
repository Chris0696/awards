import { AdminStats, OwnerStats } from "@/app/common/types/stats";
import {
  getAdminStats,
  getOwnerStats,
} from "@/frontendlib/services/statsService";
import { create } from "zustand";

type Stats = {
  adminStats: AdminStats | null;
  ownerStats: OwnerStats | null;
  getAdminStats: () => Promise<void>;
  getOwnerStats: () => Promise<void>;
};

export const useDashboardStatsStore = create<Stats>((set) => ({
  adminStats: null,
  ownerStats: null,
  getAdminStats: async () => {
    const adminStats = await getAdminStats();
    set({ adminStats });
  },
  getOwnerStats: async () => {
    const ownerStats = await getOwnerStats();
    set({ ownerStats });
  },
}));
