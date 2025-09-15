import { PublicProject } from "@/app/(landing)/projects/ProjectsList";
import {
  AdminProjectInfo,
  ProjectInfo,
  ProjectInput,
} from "@/app/common/types/project";
import { projectService } from "@/frontendlib/services/projectService";

import { create } from "zustand";

interface ProjectStore {
  publicProjects: PublicProject[];
  projects: ProjectInfo[];
  adminProjects: AdminProjectInfo[];
  setProjects: () => Promise<void>;
  setAdminProjects: () => Promise<void>;
  setPublicProjects: () => Promise<void>;
  deleteOwnerProject: (id: string) => Promise<void>;
}
export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  adminProjects: [],
  publicProjects: [],
  setProjects: async () => {
    const projects = await projectService.getProjects();
    set({ projects: projects });
  },
  setAdminProjects: async () => {
    const adminProjects = await projectService.getAdminProjects();
    set({ adminProjects: adminProjects });
  },
  setPublicProjects: async () => {
    const publicProjects = await projectService.getPublicProjects();
    set({ publicProjects: publicProjects });
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
