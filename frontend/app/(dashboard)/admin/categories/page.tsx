"use client";

import { AdminCategory, Category } from "@/app/common/types/category";
import { useEffect, useState } from "react";
import DashboardHeader from "../../DasboardHeader";
import ProjectOverviewCard from "@/components/dashboard/admin/ProjectOverviewCard";
import CreateCategoryModal from "./CreateCategoryModal";
import { useCategoryStore } from "@/stores/useCategoryStore";

export default function page() {
  const [showModal, setShowModal] = useState(false);

  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  useEffect(() => {
    fetchCategories();
  }, []);

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
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mb-10 gap-4">
        {categories.map((category) => (
          <ProjectOverviewCard
            key={category.category_id}
            color="text-[#CECE2C]"
            title={category.category_name}
            total={category.project_count}
          />
        ))}
      </div>
      <CreateCategoryModal showModal={showModal} setShowModal={setShowModal} />
    </section>
  );
}
