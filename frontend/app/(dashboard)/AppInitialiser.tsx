"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import React, { useEffect } from "react";

export default function AppInitialiser({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);
  return <>{children} </>;
}
