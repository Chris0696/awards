"use client";

import { useState } from "react";
import DashboardHeader from "../DasboardHeader";
import CreateCategoryModal from "./CreateCategoryModal";

import CategoryCard from "./CategoryCard";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminCategories } from "@/services/categoryService";

export default function page() {
  const [showModal, setShowModal] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAdminCategories(),
  });

  return (
    <section>
      <DashboardHeader pageTitle="Liste des catégories" />
      <div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary px-4 py-3 rounded-lg text-gray-50 flex items-center space-x-2 mt-6 text-lg cursor-pointer hover:border hover:border-primary hover:bg-white hover:text-primary transition-colors ml-auto"
        >
          <span>Ajouter une catégorie </span>
        </button>
      </div>
      {categories?.data?.length > 0 ? (
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mb-10 gap-4">
          {categories?.data?.map((category) => (
            <CategoryCard
              key={category.category_id}
              color="text-[#CECE2C]"
              category={category}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-primary text-3xl font-medium">
          Vous n'avez ajouté aucune catégorie pour le moment
        </p>
      )}
      <CreateCategoryModal showModal={showModal} setShowModal={setShowModal} />
    </section>
  );
}
