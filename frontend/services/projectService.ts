import { PublicProject } from "@/app/(landing)/projects/ProjectsList";
import apiClient from "./apiClient";

export const getPublicProjects = async (): Promise<PublicProject[]> => {
  const res = await apiClient.get(`public/projects/`);
  return res.data;
};

export const submitFirstProject = async (data: FormData) => {
  const res = await apiClient.post("register-with-payment/", data, {
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
