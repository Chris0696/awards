"use client";
import { fetchPublicCategories } from "@/services/categoryService";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Categories } from "../../projects/ProjectsList";

export default function SelectField({ name }: { name: string }) {
  const { control } = useFormContext();
  const { data: categories } = useQuery({
    queryKey: ["publicCategories"],
    queryFn: () => fetchPublicCategories(),
  });

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
                {categories?.map((category: Categories, idx: number) => (
                  <option key={idx} value={category.category_id}>
                    {category.category_name}{" "}
                  </option>
                ))}
                <option value="other">Autre</option>
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
