"use client";
import { Category } from "@/app/common/types/category";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function SelectField({ name }: { name: string }) {
  const { control } = useFormContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);
  return (
    <div>
      <label className="block text-gray-800 text-lg font-medium">
        <span>Catégorie du projet</span>
        <span className="text-red-500">*</span>
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="relative">
              <select
                {...field}
                className="appearance-none border-none outline-none bg-gray-100 px-2 py-2 rounded-md w-full text-gray-500 text-lg"
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((category, idx) => (
                  <option key={idx} value={category.category_id}>
                    {category.category_name}{" "}
                  </option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <ChevronDown size={20} />
              </span>
            </div>
            <p className="text-sm text-red-500">{error?.message} </p>
          </>
        )}
      />
    </div>
  );
}
