import { ProjectInfo, ProjectInput } from "@/app/common/types/project";
import { projectService } from "@/frontendlib/services/projectService";

import { create } from "zustand";

interface ProjectStore {
  projects: ProjectInfo[];
  setProjects: () => Promise<void>;
}
export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],

  setProjects: async () => {
    const projects = await projectService.getProjects();
    set({ projects: projects });
  },

  updateProject: async (project: ProjectInput) => {
    await projectService.updateProject(project);
  },
}));
