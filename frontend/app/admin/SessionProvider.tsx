"use client";
import { useQuery } from "@tanstack/react-query";
import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { createSession } from "@/services/session";
import { useEffect } from "react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const setUserSession = useUserSessionStore((state) => state.setUserSession);
  const { data } = useQuery({
    queryKey: ["userSession"],
    queryFn: () => createSession(),
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
