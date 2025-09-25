"use client";
import DashboardHeader from "@/app/(dashboard)/DasboardHeader";
import FilterBtn from "@/components/dashboard/FilterBtn";
import Table from "@/components/dashboard/Table";
import SwitchPageBtn from "@/components/dashboard/SwitchPageBtn";
import {
  ArrowRight,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import CreateNewAuthProjectModal from "./CreateNewAuthProjectModal";
import { useState } from "react";
import { useProjectStore } from "@/stores/useProjectStore";
import AdminTable from "@/components/dashboard/AdminTable";

export default function AdminProjectList() {
  const [showModal, setShowModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const projects = useProjectStore((state) => state.projects);
  const adminProjects = useProjectStore((state) => state.adminProjects);

  return user?.user_type === "owner" ? (
    <section>
      <DashboardHeader pageTitle="Mes projets" />
      {projects ? (
        <div>
          <Table projects={projects} />
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
          <FilterBtn text="Date" />
          <FilterBtn text="Statut" />
          <FilterBtn text="Catégorie" />
        </div>
        {adminProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <AdminTable projects={adminProjects} />
            <SwitchPageBtn />
          </div>
        ) : (
          <p className="text-center text-primary text-3xl font-medium">
            Vous n'avez ajouté personne pour le moment
          </p>
        )}
      </div>
    </section>
  );
}
