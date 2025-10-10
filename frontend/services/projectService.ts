import { PublicProject } from "@/app/(landing)/projects/ProjectsList";
import apiClient from "./apiClient";

export const getPublicProjects = async (): Promise<PublicProject[]> => {
  const res = await apiClient.get(`public/projects/`);
  return res.data;
};

export const submitFirstProject = async (data: FormData) => {
  const res = await apiClient.post("auth/register/authorproject", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const submitNewProject = async (data: FormData) => {
  const res = await apiClient.post("projects/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getProjectsAsAdmin = async () => {
  const res = await apiClient.get("admin/projects/");
  return res.data;
};

export const getProjectsAsOwner = async () => {
  const res = await apiClient.get("projects/");
  return res.data;
};

export const updateProjectAsAdmin = async ({
  project,
  id,
}: {
  project: FormData;
  id: string;
}) => {
  const res = await apiClient.patch(`admin/projects/${id}/`, project, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateProjectAsOwner = async ({
  project,
  id,
}: {
  project: FormData;
  id: string;
}) => {
  const res = await apiClient.patch(`projects/${id}/update/`, project, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const validateProjectAsAdmin = async (id: string) => {
  const res = await apiClient.post(`admin/projects/${id}/validate_project/`);
  return res.data;
};

export const rejectProjectAsAdmin = async ({
  id,
  admin_comment,
}: {
  id: string;
  admin_comment: string;
}) => {
  const res = await apiClient.post(`admin/projects/${id}/reject_project/`, {
    admin_comment,
  });
  return res.data;
};

export const deleteProjectAsOwner = async (id: string) => {
  const res = await apiClient.delete(`projects/${id}/delete/`);
  return res.data;
};

export const markProjectPublicAsOwner = async ({
  category_id,
  owner_project_status,
  project_id,
}: {
  category_id: string;
  owner_project_status: string;
  project_id: string;
}) => {
  const res = await apiClient.patch(`projects/${project_id}/update/`, {
    category_id,
    owner_project_status,
  });
  return res.data;
};
