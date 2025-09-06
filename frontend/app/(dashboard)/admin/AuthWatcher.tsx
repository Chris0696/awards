"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { jwtDecode } from "jwt-decode";

export function AuthWatcher() {
  const { accessToken, refreshToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    const decoded: any = jwtDecode(accessToken);
    if (!decoded.exp) return;

    const exp = decoded.exp * 1000;
    const delay = exp - Date.now() - 5000; // 5s avant expiration

    if (delay > 0) {
      const timer = setTimeout(() => {
        refreshToken().catch(() => {});
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [accessToken, refreshToken]);

  return null;
}
