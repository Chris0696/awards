import {
  getCurrentUser,
  getUserInfo,
} from "@/frontendlib/services/authService";
import { create } from "zustand";

interface User {
  user_id: number;
  full_name: string;
  email: string;
  username: string;
  user_type: string;
}

type UserInfo = {
  id: number;
  image: string;
  full_name: string;
  phone: string;
  profession: string;
  date: string;
  user: number;
};

interface AuthState {
  accessToken: string | null;
  userInfo: UserInfo | null;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  loadUser: () => Promise<void>;
  getUserInfo: (user_id: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  userInfo: null,

  login: async (token: string) => {
    set({ accessToken: token });
    await get().loadUser();
  },
  getUserInfo: async (user_id: number) => {
    const user = await getUserInfo(user_id);
    set({ userInfo: user });
  },
  logout: async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Erreur lors du logout:", data);
      }
    } catch (err) {
      console.error("Erreur réseau lors du logout:", err);
    } finally {
      set({ accessToken: null, user: null });
    }
  },

  refreshToken: async () => {
    const res = await fetch("/api/auth/refresh", { method: "POST" });
    if (!res.ok) {
      set({ accessToken: null, user: null });
      throw new Error("Impossible de rafraîchir le token");
    }
    const data = await res.json();
    set({ accessToken: data.access });
    await get().loadUser();
  },

  loadUser: async () => {
    try {
      const user = await getCurrentUser();
      set({ user });
    } catch (err: any) {
      if (err.status === 401) {
        try {
          await get().refreshToken();
          const user = await getCurrentUser();
          set({ user });
        } catch {
          set({ user: null });
        }
      } else {
        set({ user: null });
      }
    }
  },
}));
