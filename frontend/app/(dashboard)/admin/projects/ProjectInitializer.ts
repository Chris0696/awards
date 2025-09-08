"use client";
import { useEffect } from "react";
import { useProjectStore } from "@/stores/useProjectStore";

export function ProjectInitializer() {
  const setProjects = useProjectStore((state) => (state as any).setProjects);

  useEffect(() => {
    setProjects();
  }, [setProjects]);

  return null;
}
