import { IUserInfo } from "@/app/(dashboard)/admin/account/page";
import { useAuthStore } from "@/stores/useAuthStore";

export async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw { message: "Erreur d’authentification", body: data };
  }

  await useAuthStore.getState().login(data.access);

  return data;
}

export async function logout() {
  await useAuthStore.getState().logout();
}

export async function getCurrentUser() {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (!res.ok) {
    const error: any = new Error("Utilisateur non authentifié");
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function getUserInfo(user_id: number) {
  try {
    const res = await fetch(`/api/auth/user-info?user_id=${user_id}`);
    if (!res.ok) throw new Error("Failed to fetch user infos");
    return res.json();
  } catch (error) {
    console.log("Error fetching categories:", error);
  }
}

export async function updateUserInfo(formData: FormData) {
  try {
    const res = await fetch("/api/auth/user-info", {
      method: "POST",

      body: formData,
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw { message: "Erreur lors de la mise à jour", body: errorBody };
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
}
