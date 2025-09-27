/* export async function getOwners() {
  const res = await fetch("/api/auth/admin/owners", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur à la récupération des statistique");
  return res.json();
} */

export async function deleteUser(id: number) {
  try {
    const res = await fetch("/api/auth/admin/owners", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw { message: "Erreur lors de la supression", body: errorBody };
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
}
