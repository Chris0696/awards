import { AuthForm } from "@/app/(landing)/login/LoginForm";

import { clearTokens, getTokens, saveTokens } from "./session";
import apiClient from "./apiClient";
import { ChangePwForm } from "@/app/admin/settings/page";

export const loginUser = async (credentials: AuthForm) => {
  const res = await apiClient.post("auth/login/", credentials);
  await saveTokens(res.data.access, res.data.refresh);
  return res.data;
};

export const logoutUser = async () => {
  const tokens = await getTokens();
  const refresh = tokens.refresh;
  const res = await apiClient.post("auth/logout/", { refresh });
  await clearTokens();
  return res.data;
};

export const resetPassword = async (email: string) => {
  const res = await apiClient.get(`auth/password-reset/${email}/`);
  return res.data;
};

export const confirmPassword = async () => {
  const res = await apiClient.post(`auth/password-change/`);
  return res.data;
};

type PasswordData = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

export const changePassword = async (data: PasswordData) => {
  const res = await apiClient.patch(`auth/change-password/`, data);
  return res.data;
};
