import { deleteUser, getOwners } from "@/frontendlib/services/userService";
import { create } from "zustand";

export type User = {
  accept_project_reformulation: boolean;
  accept_terms_of_use: boolean;
  age: number;
  commercial: string | null;
  country_code: string;
  created_at: string;
  full_name: string;
  id: number;
  phone: string;
  profession: string;
  published_projects: number;
  rejected_projects: number;
  total_projects: number;
  total_votes_received: number;
};
type UserStore = {
  user: User[];
  getUsers: () => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: [],
  getUsers: async () => {
    const users = await getOwners();
    set({ user: users.results });
  },
  deleteUser: async (id: number) => {
    await deleteUser(id);
  },
}));
