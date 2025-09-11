"use client";
import { useEffect } from "react";
import { useProjectStore } from "@/stores/useProjectStore";
import { useAuthStore } from "@/stores/useAuthStore";

export function ProjectInitializer() {
  const user = useAuthStore((state) => state.user);
  const setProjects = useProjectStore((state) => state.setProjects);
  const setAdminProjects = useProjectStore((state) => state.setAdminProjects);

  useEffect(() => {
    if (user?.user_type === "owner") {
      setProjects();
    }
    if (user?.user_type === "user") {
      setAdminProjects();
    }
  }, [setProjects, user]);

  /* useEffect(() => {
    setAdminProjects();
  }, [setAdminProjects]); */
  return null;
}
