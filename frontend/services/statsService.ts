import { AdminStats } from "@/app/common/types/stats";
import apiClient from "./apiClient";

export const getAdmStats = async (): Promise<AdminStats> => {
  const res = await apiClient.get("dashboard/admin/");
  return res.data;
};

export const getOwnerStats = async () => {
  const res = await apiClient.get("dashboard/owner/");
  return res.data;
};

export const getCommercialStats = async () => {
  const res = await apiClient.get("dashboard/commercial/");
  return res.data;
};

export const getProjectsToRank = async () => {
  const res = await apiClient.get("admin/projects/");
  return res.data;
};

export const getDashboardAnalytics = async () => {
  const res = await apiClient.get("analytics/dashboard-summary/");
  return res.data;
};
export const getProjectsEvolution = async () => {
  const res = await apiClient.get("analytics/projects-evolution/");
  return res.data;
};

export const getVotesEvolution = async () => {
  const res = await apiClient.get("analytics/votes-evolution/");
  return res.data;
};
