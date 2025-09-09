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
