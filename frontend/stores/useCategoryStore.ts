import { create } from "zustand";

import { AdminCategory, Category } from "@/app/common/types/category";
import {
  createCategory,
  deleteCategory,
  fetchAdminCategories,
  updateCategory,
} from "@/frontendlib/services/categoryService";

interface CategoryStore {
  categories: AdminCategory[];
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (category_id: string) => Promise<void>;
  updateCategory: (category_name: string, category_id: string) => Promise<void>;
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
  deleteCategory: async (category_id: string) => {
    await deleteCategory(category_id);
    await get().fetchCategories();
  },
  updateCategory: async (category_name, category_id) => {
    await updateCategory(category_name, category_id);
    await get().fetchCategories();
  },
}));
