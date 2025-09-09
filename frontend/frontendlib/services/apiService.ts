import { apiFetch } from "../apiClient";

export async function getProfile() {
  const res = await apiFetch("/api/me/");
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}
