import apiClient from "./apiClient";

export const createCategory = async (category_name: string) => {
  const res = await apiClient.post("admin/categories/", { category_name });
  return res.data;
};

export const fetchPublicCategories = async () => {
  const res = await apiClient.get("categories/");
  return res.data;
};
export const fetchAdminCategories = async () => {
  const res = await apiClient.get("admin/categories/");
  return res.data;
};

export const updateCategory = async ({
  category_id,
  category_name,
}: {
  category_id: number;
  category_name: string;
}) => {
  const res = await apiClient.put(`admin/categories/${category_id}/`, {
    category_name,
  });
  return res.data;
};

export const deleteCategory = async (category_id: number) => {
  const res = await apiClient.delete(`admin/categories/${category_id}/`);
  return res.data;
};
