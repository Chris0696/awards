"use client";
import DashboardHeader from "@/app/admin/DasboardHeader";
import FilterBtn from "@/components/dashboard/FilterBtn";
import Table from "@/components/dashboard/Table";
import SwitchPageBtn from "@/components/dashboard/SwitchPageBtn";
import {
  ArrowRight,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
} from "lucide-react";

import CreateNewAuthProjectModal from "./CreateNewAuthProjectModal";
import { useState } from "react";
import AdminTable from "@/components/dashboard/AdminTable";
import { useQuery } from "@tanstack/react-query";
import {
  getProjectsAsAdmin,
  getProjectsAsOwner,
} from "@/services/projectService";
import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { fetchAdminCategories } from "@/services/categoryService";
import { Category } from "@/app/common/types/category";
import { AdminProjectInfo, ProjectInfo } from "@/app/common/types/project";

export default function AdminProjectList() {
  const [showModal, setShowModal] = useState(false);
  const user = useUserSessionStore((state) => state.user);
  const [selectedSatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: adminProjects } = useQuery({
    queryKey: ["adminProjects"],
    queryFn: () => getProjectsAsAdmin(),
    enabled: user?.user_type === "user" || user?.user_type === "admin",
  });

  const { data: ownerProjects } = useQuery({
    queryKey: ["ownerProjects"],
    queryFn: () => getProjectsAsOwner(),
    enabled: user?.user_type === "owner",
  });

  const { data: categories } = useQuery({
    queryKey: ["ownerProjects"],
    queryFn: () => fetchAdminCategories(),
    enabled: user?.user_type === "user",
  });

  const cleanedCategories = categories?.data?.map((cat: Category) => ({
    value: cat.category_id,
    text: cat.category_name,
  }));

  const filteredProjects = adminProjects?.filter(
    (project: AdminProjectInfo) => {
      if (selectedSatus && project.platform_status !== selectedSatus) {
        return false;
      }
      if (selectedCategory && project.category_id !== selectedCategory) {
        return false;
      }
      return true;
    }
  );

  return user?.user_type === "owner" ? (
    <section>
      <DashboardHeader pageTitle="Mes projets" />
      {ownerProjects ? (
        <div>
          <Table projects={ownerProjects} />
          <div className="mt-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary px-4 py-5 rounded-lg text-gray-50 flex items-center space-x-2 mt-6 text-lg cursor-pointer hover:border hover:border-primary hover:bg-white hover:text-primary transition-colors ml-auto"
            >
              <span>Soumettre un nouveau projet</span> <ChevronRight />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-28 text-center space-y-6">
          <h2 className="text-6xl font-bold">
            Vous n'avez encore soumis aucun projet.
          </h2>
          <p className="text-xl text-gray-900">
            Cliquez sur le bouton ci-dessous pour proposer votre première idée
            et participer à l'aventure Project Awards
          </p>
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary p-4 rounded-lg text-gray-50 flex items-center space-x-2 mt-6 text-lg cursor-pointer hover:border hover:border-primary hover:bg-white hover:text-primary transition-colors mx-auto"
            >
              <span>Soumettre un nouveau projet</span> <ChevronRight />
            </button>
          </div>
        </div>
      )}
      <CreateNewAuthProjectModal
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </section>
  ) : (
    <section>
      <DashboardHeader pageTitle="Projets" />
      <div>
        <div className=" flex justify-end space-x-3  mb-5">
          {/* <FilterBtn
            defaultText="Date"
            options={["Date", "Statut", "Catégorie"]}
          /> */}
          <FilterBtn
            onChange={(value) => setSelectedStatus(value)}
            defaultText="Statut"
            options={[
              { value: "brouillon", text: "Brouillon" },
              { value: "publie", text: "Publiée" },
              { value: "rejete", text: "Rejetée" },
            ]}
          />
          <FilterBtn
            onChange={(value) => setSelectedCategory(value)}
            defaultText="Catégorie"
            options={cleanedCategories}
          />
        </div>

        <div className="overflow-x-auto">
          <AdminTable projects={filteredProjects ?? []} />
          <SwitchPageBtn />
        </div>
      </div>
    </section>
  );
}
