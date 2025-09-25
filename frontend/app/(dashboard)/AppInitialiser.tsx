"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

export default function AppInitialiser({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadUser = useAuthStore((state) => state.loadUser);
  const user = useAuthStore((state) => state.user);
  const getUserInfo = useAuthStore((state) => state.getUserInfo);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (user) {
      getUserInfo(user.user_id);
    }
  }, [user, getUserInfo]);

  return <>{children} </>;
}
