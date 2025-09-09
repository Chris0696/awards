export async function getCategories() {
  const res = await fetch("/api/categories", { cache: "no-store" });
  if (!res.ok) throw new Error("Impossible de récupérer les catégories");
  return res.json();
}

export async function fetchAdminCategories() {
  try {
    const res = await fetch("/api/categories/privates");
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  } catch (error) {
    console.log("Error fetching categories:", error);
  }
}

export async function createCategory(category_name: string) {
  try {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category_name }),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw { message: "Erreur lors de la création", body: errorBody };
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
}
