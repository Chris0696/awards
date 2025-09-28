import axios from "axios";

import { clearTokens, getTokens } from "./session";
import { refreshToken } from "./authService";

const isProd = process.env.NODE_ENV === "production";
const baseURL = isProd
  ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
  : process.env.NEXT_PUBLIC_BACKEND_URL;

const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use(async (config) => {
  const tokens = await getTokens();
  const access = tokens.access;
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const tokens = await getTokens();
        const refresh = tokens.refresh;
        if (!refresh) await clearTokens();
        else {
          const newAccess = await refreshToken(refresh);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }
        return apiClient(originalRequest);
      } catch (error) {
        await clearTokens();
        console.log(error);
      }
    }
  }
);

export default apiClient;
