import { AuthForm } from "@/app/(landing)/login/LoginForm";

import { clearTokens, getTokens, saveTokens } from "./session";
import apiClient from "./apiClient";

export const loginUser = async (credentials: AuthForm) => {
  const res = await apiClient.post("auth/login/", credentials);
  await saveTokens(res.data.access, res.data.refresh);
};

export const logoutUser = async () => {
  const tokens = await getTokens();
  const refresh = tokens.refresh;
  const res = await apiClient.post("auth/logout/", { refresh });
  await clearTokens();
  return res.data;
};

export const refreshToken = async (refresh: string) => {
  const res = await apiClient.post("auth/refresh/", { refresh });
  await saveTokens(res.data.access, res.data.refresh);
  return res.data.access;
};
