import { getCurrentUser } from "@/lib/services/authService";
import { create } from "zustand";

interface User {
  user_id: number;
  full_name: string;
  email: string;
  username: string;
  user_type: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,

  login: async (token: string) => {
    set({ accessToken: token });
    await get().loadUser(); // charge le user via /api/auth/me
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
