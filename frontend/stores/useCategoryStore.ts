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
  deleteCategory: (category_id: number) => Promise<void>;
  updateCategory: (category_name: string, id: number) => Promise<void>;
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
  deleteCategory: async (category_id: number) => {
    await deleteCategory(category_id);
    await get().fetchCategories();
  },
  updateCategory: async (category_name, id) => {
    await updateCategory(category_name, id);
    await get().fetchCategories();
  },
}));
