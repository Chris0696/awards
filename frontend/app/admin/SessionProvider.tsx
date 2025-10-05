"use client";
import { useQuery } from "@tanstack/react-query";
import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { createSession } from "@/services/session";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

async function fetchSession() {
  const res = await fetch("/api/v1/auth/session", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("No session");
  return res.json();
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const setUserSession = useUserSessionStore((state) => state.setUserSession);
  const { data } = useQuery({
    queryKey: ["userSession"],
    queryFn: () => fetchSession(),
    //retry: false,
  });

  /* useEffect(() => {
    if (
      data &&
      "user_id" in data &&
      "email" in data &&
      "full_name" in data &&
      "username" in data &&
      "user_type" in data
    ) {
      setUserSession(data);
    }
  }, [data, setUserSession]); */
  useEffect(() => {
    if (data?.access) {
      try {
        const decoded = jwtDecode<any>(data.access);
        const user = {
          user_id: decoded.user_id,
          email: decoded.email,
          full_name: decoded.full_name,
          username: decoded.username,
          user_type: decoded.user_type,
        };
        setUserSession(user);
      } catch (err) {
        console.error("JWT decode failed", err);
      }
    }
  }, [data, setUserSession]);

  return <>{children}</>;
}
