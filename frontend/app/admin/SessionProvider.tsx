"use client";
import { useQuery } from "@tanstack/react-query";
import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { createSession } from "@/services/session";
import { useEffect } from "react";

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
    queryFn: () => createSession(),
    //retry: false,
  });

  useEffect(() => {
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
  }, [data, setUserSession]);

  return <>{children}</>;
}
