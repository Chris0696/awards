export async function getAdminStats() {
  const res = await fetch("/api/stats/admin", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur à la récupération des statistique");
  return res.json();
}

export async function getOwnerStats() {
  const res = await fetch("/api/stats/owner", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur à la récupération des statistique");
  return res.json();
}
