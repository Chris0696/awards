import { User } from "@/components/modals/AddGdChildModal";
import apiClient, { BackendError } from "./apiClient";
import { AxiosError } from "axios";

export const getUserInfo = async (userId: number) => {
  const res = await apiClient.get(`auth/globalprofile/${userId}/`);
  return res.data;
};

export const getOwnersList = async () => {
  const res = await apiClient.get("admin/owners/");
  return res.data;
};

export const getAdminRelatedUsers = async () => {
  const res = await apiClient.get("admin/users/commercial/");
  return res.data;
};

export const addAdminRelatedUser = async (data: User) => {
  try {
    const res = await apiClient.post("admin/users/commercial/", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const updateAdminRelatedUser = async (data: User) => {
  const res = await apiClient.patch(`admin/users/commercial/${data.id}/`, data);
  return res.data;
};

export const deleteAdminRelatedUser = async (userId: number) => {
  const res = await apiClient.delete(`admin/users/commercial/${userId}/`);
  return res.data;
};

export const updateUserInfo = async (data: FormData) => {
  const res = await apiClient.put(
    `auth/globalprofile/${data.get("user_id")}/`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const toggleOwnerAccountAsAdmin = async (id: number) => {
  const res = await apiClient.patch(`admin/owners/${id}/toggle_active/`);
  return res.data;
};

export const deleteOwner = async (id: number) => {
  return await apiClient.delete(`admin/owners/${id}/delete/`);
};

export const getAffiliateDetails = async (id: number) => {
  const res = await apiClient.get(`admin/users/commercial/${id}/`);
  return res.data;
};
