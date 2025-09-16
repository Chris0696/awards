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
  publicProjectDetails: ProjectInfo | null;
  projects: ProjectInfo[];
  adminProjects: AdminProjectInfo[];
  setProjects: () => Promise<void>;
  setAdminProjects: () => Promise<void>;
  setPublicProjects: () => Promise<void>;
  setPublicProjectDetails: (slug: string) => Promise<void>;
  deleteOwnerProject: (id: string) => Promise<void>;
}
export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  adminProjects: [],
  publicProjects: [],
  publicProjectDetails: null,
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
  setPublicProjectDetails: async (slug: string) => {
    const publicProject = await projectService.getPublicProject(slug);
    set({ publicProjectDetails: publicProject });
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
