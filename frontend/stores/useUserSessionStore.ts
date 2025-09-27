import { create } from "zustand";

export type User = {
  email: string;
  full_name: string;
  user_id: number;
  user_type: string;
  username: string;
};
export type AdditionalUserInfo = {
  id: number;
  image: string;
  full_name: string;
  phone: string | null;
  profession: string | null;
  date: string;
  user: number;
};
type SessionStore = {
  user: User | null;
  additionalInfo?: AdditionalUserInfo | null;
  setUserSession: (user: User) => void;
  setAdditionalInfo?: (info: AdditionalUserInfo) => void;
};

export const useUserSessionStore = create<SessionStore>((set) => ({
  user: null,
  setUserSession: (user) => {
    set({ user });
  },
  setAdditionalInfo: (info) => {
    set({ additionalInfo: info });
  },
}));
