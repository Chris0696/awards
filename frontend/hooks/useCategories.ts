import { useEffect, useState } from "react";

type Category = {
  category_id: string;
  category_name: string;
  image: string;
  slug: string;
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cached = localStorage.getItem("categories");
        if (cached) {
          setCategories(JSON.parse(cached));
          setLoading(false);
          return;
        }
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        setCategories(data);
        localStorage.setItem("categories", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading };
}
