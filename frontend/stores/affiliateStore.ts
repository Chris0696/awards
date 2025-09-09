import { AffiliateInfo, AffiliateInput } from "@/app/common/types/affiliate";
import { affiliateService } from "@/frontendlib/services/affiliateService";
import { create } from "zustand";

interface AffiliateStore {
  affiliates: AffiliateInfo[];
  fetchAffiliates: () => Promise<void>;
  addAffiliate: (data: AffiliateInput) => Promise<void>;
}

export const useAffiliateStore = create<AffiliateStore>((set, get) => ({
  affiliates: [],

  fetchAffiliates: async () => {
    const affiliates: AffiliateInfo[] = await affiliateService.getAffiliates();
    set({ affiliates });
  },

  addAffiliate: async (data: AffiliateInput) => {
    const newAffiliate = (await affiliateService.createAffiliate(
      data
    )) as AffiliateInfo;
    set((state) => ({
      affiliates: [...state.affiliates, newAffiliate],
    }));
  },
}));
