import { AdminStats } from "@/app/common/types/stats";
import apiClient from "./apiClient";

export const getAdmStats = async (): Promise<AdminStats> => {
  const res = await apiClient.get("dashboard/admin/");
  return res.data;
};

export const getProjectsToRank = async () => {
  const res = await apiClient.get("admin/projects/");
  return res.data;
};
