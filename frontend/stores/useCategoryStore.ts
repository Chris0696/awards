import { create } from "zustand";

import { AdminCategory, Category } from "@/app/common/types/category";
import {
  createCategory,
  fetchAdminCategories,
} from "@/frontendlib/services/categoryService";

interface CategoryStore {
  categories: AdminCategory[];
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],

  fetchCategories: async () => {
    const categories = await fetchAdminCategories();
    set({ categories });
  },

  addCategory: async (name: string) => {
    await createCategory(name);
    await get().fetchCategories();
  },
}));
