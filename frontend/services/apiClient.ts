import axios from "axios";
export type BackendError = {
  error: string[];
};
import { clearTokens } from "./session";

/** Récupère le token d'accès via l'API route (évite Server Action dont l'ID peut devenir invalide en dev). */
async function getAccessToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/v1/auth/session", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access ?? null;
  } catch {
    return null;
  }
}

const isProd = process.env.NODE_ENV === "production";
const baseURL =
  isProd
    ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    : process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:8001/api/v1/"; /* fallback si backend sur 8001 */

const apiClient = axios.create({
  baseURL,
  withCredentials: isProd,
});
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

apiClient.interceptors.request.use(async (config) => {
  const access = await getAccessToken();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.post("/api/v1/auth/refresh");
        const newAccess = refreshRes.data.access;

        isRefreshing = false;
        onRefreshed(newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(originalRequest);
      } catch (err) {
        isRefreshing = false;
        await clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
