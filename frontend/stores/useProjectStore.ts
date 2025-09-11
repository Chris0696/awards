import {
  AdminProjectInfo,
  ProjectInfo,
  ProjectInput,
} from "@/app/common/types/project";
import { projectService } from "@/frontendlib/services/projectService";

import { create } from "zustand";

interface ProjectStore {
  projects: ProjectInfo[];
  adminProjects: AdminProjectInfo[];
  setProjects: () => Promise<void>;
  setAdminProjects: () => Promise<void>;
  deleteOwnerProject: (id: string) => Promise<void>;
}
export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  adminProjects: [],
  setProjects: async () => {
    const projects = await projectService.getProjects();
    set({ projects: projects });
  },
  setAdminProjects: async () => {
    const adminProjects = await projectService.getAdminProjects();
    set({ adminProjects: adminProjects });
  },
  updateProject: async (project: ProjectInput) => {
    await projectService.updateProject(project);
  },
  adminPublishProject: async (project: ProjectInput) => {
    await projectService.adminPublishProject(project);
  },
  deleteOwnerProject: async (project_id: string) => {
    await projectService.deleteOwnerProject(project_id);
  },
}));
